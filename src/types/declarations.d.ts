/**
 * Declaration for parse/node to fix build error
 * "Could not find a declaration file for module 'parse/node'"
 */
declare module 'parse/node' {
    import Parse from 'parse';
    export default Parse;
}
