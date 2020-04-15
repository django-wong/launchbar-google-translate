/**
 * Translate given string to other language
 *
 * @param      {<type>}  text    The text
 */
function translate(text, from = 'auto', to = null) {
    if (!to) to = Action.preferences.preferedLanguage || 'en';

    const response = HTTP.getJSON(createRequestOptions(text, from, to));

    if (!response.data) {
        return NO_RESPONSE;
    }

    return format(response.data).concat(
        otherLanguages(text)
    );
}

/**
 * Format the translation result into action items
 *
 * @param      {array}  response  The response
 * @return     {items}
 */
function format(response) {
    const [translation, related, source_lang, , , , , , , , , synonyms, usages, examples] = response;
    const items = [];
    if (translation) {
        items.push(...formatTranslations(translation, source_lang));
    }

    if (examples) {
        items.push(...formatExamples(examples));
    }

    if (related) {
        items.push(...formatRelatedWords(related));
    }

    if (synonyms) {
        items.push(...formatSynonyms(synonyms));
    }

    if (usages) {
        items.push(...formatUsages(usages));
    }

    return items;
}

/**
 * format translation data
 *
 * @param      {array}  translation  The translation
 * @return     {items}
 */
function formatTranslations(translation, source_lang = '') {
    const items = [];

    translation.forEach((item, index, origin) => {
        const [trans, source, target_pronunciation, source_pronunciation] = item;
        if (trans) {
            items.push({
                alwaysShowsSubtitle: source ? true : undefined,
                subtitle: source || undefined,
                title: trans
            });
        }

        if (target_pronunciation) {
            items.push({title: target_pronunciation});
        }

        if (source_pronunciation) {
            items.push({title: source_pronunciation});
        }
    });

    return items;
}

/**
 * Format usages
 *
 * @param      {array}  usages  The usages
 * @return     {items}
 */
function formatUsages(usages) {
    const result = usages.map(group => {
        const [kind, samples, related_to] = group
        return {icon: 'font-awesome:fa-info', title: kind, badge: samples.length.toString(), children: samples.map(sample => {
            return {
                icon: 'font-awesome:fa-info',
                // alwaysShowsSubtitle: true,
                title: sample[0],
                subtitle: sample[2],
                children: [
                    {title: sample[2]}
                ]
            }
        })}
    });

    if (!result.length) {
        return [];
    }

    const item = {
        icon: 'font-awesome:fa-external-link-square',
        title: '用法与例子',
        badge: result.length.toString().concat(' 种'),
    }

    item.actionReturnsItems = true;
    item.action = 'listItems';
    item.actionArgument = {items: result};

    return [ item ];
}

/**
 * Format exclamation
 *
 * @param      {items}  exclamation  The exclamation
 * @return     {items}
 */
function formatExclamation(exclamation) {
    const [key, examples, ...others] = exclamation;
    const items = [];
    if (examples) {
        examples.forEach((example, index) => {
            items.push(
                {title: example[0], subtitle: example[2], alwaysShowsSubtitle: true, badge: index === 0 ? 'Exclamation' : ''}
            );
        })
    }
    return items;
}

/**
 * Format examples
 *
 * @param      {array}  examples  The examples
 * @return     {items}
 */
function formatExamples(examples) {

    const children = examples[0].map(example => {
        return {title: prune(example[0])};
    });

    const item = {
        icon: 'font-awesome:fa-external-link-square',
        title: '查看例句',
        badge: `${examples[0].length} 种`,
    };

    item.actionArgument = {items: children};
    item.action = 'listItems';
    item.actionReturnsItems = true;

    return [ item ];
}

/**
 * Format synonyms
 *
 * @param      {array}  synonyms  The synonyms
 * @return     {items}
 */
function formatSynonyms(synonyms) {
    const children = synonyms.map(group => {
        const [type, samples, related_to] = group;
        return {
            children: samples[0][0].map(_ => ({title: _})),
            title: samples[0][0].join(', '),
            label: type,
            icon: 'font-awesome:fa-info',
        }
    });

    const item = {
        icon: 'font-awesome:fa-external-link-square',
        title: '同义词',
        badge: `${children.length} 种`
    }

    item.actionReturnsItems = true;
    item.action = 'listItems';
    item.actionArgument = {items: children};

    return [ item ];
}

/**
 * Alias to `translate` but take arguments as an object
 *
 * @param      {object}  options  The options
 * @return     {items}
 */
function trans(options) {
    if (LaunchBar.options.commandKey) {
        Action.preferences.preferedLanguage = options.to;
    }
    return translate(options.text, 'auto', options.to);
}

/**
 * Other language options
 *
 * @param      {string}  argument  The argument
 * @return     {items}
 */
function otherLanguages(argument) {
    return LANGUAGES.map((lang, index) => {
        return {
            label: index === 0 ? '按回车翻译到此语言' : '',
            icon: lang[2],
            actionArgument: {
                text: argument,
                to: lang[1]
            },
            badge: lang[1].toUpperCase(),
            title: lang[0],
            action: 'trans',
            actionReturnsItems: true,
        }
    })
}

/**
 * Format the related words
 *
 * @param      {array}  related  The related
 * @return     {items}
 */
function formatRelatedWords(related) {
    const item = {title: '相关词汇', icon: 'font-awesome:fa-external-link-square'};

    const children = related.map(group => {
        const [kind, words, samples] = group;
        return {
            icon: 'font-awesome:fa-info',
            title: words.join(', '),
            label: kind,
            children: samples.map(sample => {
                return {
                    children: sample[1].map(_ => ({title: _, icon: 'font-awesome:fa-info'})),
                    title: sample[0],
                    icon: 'font-awesome:fa-info'
                }
            })
        }
    });

    item.actionReturnsItems = true;
    item.action = 'listItems';
    item.badge = `${children.length} 种`;
    item.actionArgument = {items: children};

    return [ item ];
}