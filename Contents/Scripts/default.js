// LaunchBar Action Script

include('common.js');
include('translation.js');

/**
 * The entrypoint for this action
 *
 * @param      {string}  [argument='']  The argument
 * @return     {items}
 */
function run(argument = '') {
    try {
        if (argument && throttle(1000)) {
            return translate(argument);
        }
    } catch (e) {
        return error(e);
    }
}
