/**
 * Creates a request options.
 *
 * @param      {string}  text            The text
 * @param      {string}  [from='en']     The source language
 * @param      {string}  [to='zh']       The target language
 * @param      {string}  [client='gtx']  The client
 */
function createRequestOptions(text, from = 'auto', to = 'en', client= 'gtx') {
    return `https://translate.google.com/translate_a/single?client=${client}&sl=${from}&tl=${to}&hl=${to}&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=dj&ie=UTF-8&oe=UTF-8&otf=1&ssel=0&tsel=0&kc=7&q=${encodeURIComponent(text)}`;
}

/**
 * Wait for given ms and check if can continue to proform things
 *
 * @param      {number}  [ms=1000]  The milliseconds
 * @return     {boolean}
 */
function throttle(ms = 1000) {
    const FILE = Action.cachePath + 'throttle';
    const time = Date.now();
    File.writeText(time.toString(), FILE);
    while (Date.now() - time < ms) {
        continue;
    }
    return time.toString() === File.readText(
        FILE
    );
}

/**
 * Convert obejct to a query string
 *
 * @param      {object}    object  The object
 * @return     {string}
 */
function toQuery(object) {
    const parts = [];
    for (const key in object) {
        parts.push(`${key}=${encodeURIComponent(object[key])}`);
    }
    return parts.join('&')
}

/**
 * Format error to readable string
 *
 * @param      {any}  e
 * @return     {items}
 */
function error(e) {
    let message = '这个我是在翻译不了', label = '';

    if (e instanceof Error) {
        message = e.message || message;
        label = e.name || '';
    }

    if (typeof e === 'string') {
        message = e;
    }

    return [{title: message, icon: '😵', label}];
}

/**
 * Remove html tag from str
 *
 * @param      {string}  str     The string
 * @return     {string}
 */
function prune(str) {
    str = str.replace(/<b>|<i>/g, '');
    str = str.replace(/<\/i>|<\/b>/g, '');
    return str;
}

const LANGUAGES = [
    ["中文（简体）", "zh-CN", '🇨🇳'],
    ["英语", "en", '🇬🇧'],
    ["俄语", "ru", '🇷🇺'],
    ["法语", "fr", '🇫🇷'],
    ["德语", "de", '🇩🇪'],
    ["日语", "ja", '🇯🇵'],
    ["世界语", "eo", '🌍'],
    ["中文（繁体）", "zh-TW", '🇭🇰'],
    ["爱尔兰语", "ga", '🇮🇪'],
    ["意大利语", "it", '🇮🇹'],
    ["韩语", "ko", '🇰🇷'],
    ["荷兰语", "nl", '🇳🇱'],
    ["丹麦语", "da", '🇩🇰'],
    ["芬兰语", "fi", '🇫🇮'],
    ["希腊语", "el", '🇬🇷'],
    // ["巴斯克语", "eu", ''],
    // ["白俄罗斯语", "be", '🇧🇾'],
    // ["孟加拉语", "bn", '🇧🇩'],
    // ["波斯尼亚语", "bs", '🇧🇦'],
    // ["保加利亚语", "bg", '🇧🇬'],
    // ["加泰罗尼亚语", "ca", ''],
    // ["宿务语", "ceb"],
    // ["科西嘉语", "co"],
    // ["克罗地亚语", "hr"],
    // ["捷克语", "cs", '🇨🇿'],
    // ["爱沙尼亚语", "et", '🇪🇪'],
    // ["弗里斯兰语", "fy", ''],
    // ["加利西亚语", "gl"],
    // ["格鲁吉亚语", "ka"],
    // ["古吉拉特语", "gu"],
    // ["海地克里奥尔语", "ht"],
    // ["豪萨语", "ha"],
    // ["夏威夷语", "haw"],
    // ["希伯来语", "he", '🇮🇱'],
    // ["印地语", "hi", '🇮🇳'],
    // ["苗语", "hmn"],
    // ["匈牙利语", "hu", '🇭🇺'],
    // ["冰岛语", "is", '🇮🇸'],
    // ["伊博语", "ig", ''],
    // ["印度尼西亚语", "id", '🇮🇩'],
    // ["泰文", "th", '🇹🇭'],
    // ["爪哇语", "jv"],
    // ["卡纳达语", "kn"],
    // ["哈萨克语", "kk", '🇰🇿'],
    // ["高棉文", "km"],
    // ["库尔德语", "ku"],
    // ["吉尔吉斯语", "ky"],
    // ["老挝语", "lo", '🇱🇦'],
    // ["拉丁文", "la", '🇮🇹'],
    // ["南非荷兰语", "af", '🇿🇦'],
    // ["阿尔巴尼亚语", "sq", '🇦🇱'],
    // ["阿姆哈拉语", "am", '🇪🇹'],
    // ["阿拉伯语", "ar", '🇮🇶'],
    // ["亚美尼亚语", "hy", '🇦🇲'],
    // ["阿塞拜疆语", "az", '🇦🇿'],
    // ["拉脱维亚语", "lv"],
    // ["立陶宛语", "lt"],
    // ["卢森堡语", "lb"],
    // ["马其顿语", "mk"],
    // ["马尔加什语", "mg"],
    // ["马来语", "ms"],
    // ["马拉雅拉姆文", "ml"],
    // ["马耳他语", "mt"],
    // ["毛利语", "mi"],
    // ["马拉地语", "mr"],
    // ["蒙古文", "mn"],
    // ["缅甸语", "my"],
    // ["尼泊尔语", "ne"],
    // ["挪威语", "no"],
    // ["尼杨扎语（齐切瓦语）", "ny"],
    // ["普什图语", "ps"],
    // ["波斯语", "fa"],
    // ["波兰语", "pl"],
    // ["葡萄牙语（葡萄牙、巴西）", "pt"],
    // ["旁遮普语", "pa"],
    // ["罗马尼亚语", "ro"],
    // ["萨摩亚语", "sm"],
    // ["苏格兰盖尔语", "gd"],
    // ["塞尔维亚语", "sr"],
    // ["塞索托语", "st"],
    // ["修纳语", "sn"],
    // ["信德语", "sd"],
    // ["僧伽罗语", "si"],
    // ["斯洛伐克语", "sk"],
    // ["斯洛文尼亚语", "sl"],
    // ["索马里语", "so"],
    // ["西班牙语", "es"],
    // ["巽他语", "su"],
    // ["斯瓦希里语", "sw"],
    // ["瑞典语", "sv"],
    // ["塔加路语（菲律宾语）", "tl"],
    // ["塔吉克语", "tg"],
    // ["泰米尔语", "ta"],
    // ["泰卢固语", "te"],
    // ["土耳其语", "tr", '🇹🇷'],
    // ["乌克兰语", "uk", '🇺🇦'],
    // ["乌尔都语", "ur"],
    // ["乌兹别克语", "uz"],
    // ["越南语", "vi", '🇻🇳'],
    // ["威尔士语", "cy"],
    // ["班图语", "xh"],
    // ["意第绪语", "yi"],
    // ["约鲁巴语", "yo"],
    // ["祖鲁语", "zu"],
];

/**
 * Makes an action call.
 *
 * @param      {string}   title                          The title
 * @param      {string}   name                           The name
 * @param      {string | object}   argument                       The argument
 * @param      {boolean}  [returnItems=true]             The return items
 * @param      {string}   [icon='font-awesome:fa-info']  The icon
 * @param      {string}   [badge='']                     The badge
 * @param      {string}   [label='']                     The label
 * @return     {item}
 */
function makeActionCall(title, name, argument, returnItems = true, icon = 'font-awesome:fa-info', badge = '', label = '') {
    return {
        actionRetuensItems: returnItems,
        title, action:
        name,
        actionArgument: argument,
        icon: icon,
        badge: badge ? badge : undefined,
        label: label ? label : undefined,
    }
}

/**
 * List items
 *
 * @param      {object}  options  The options
 * @return     {items}
 */
function listItems(options) {
    return options.items;
}