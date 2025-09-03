export default Lexer;
declare class Lexer {
    input(buf: any): void;
    pos: any;
    buf: any;
    buflen: any;
    token(): {
        type: string;
        value: any;
        pos: number;
    };
    _process_digits(position: any): any;
    _process_number(): {
        type: string;
        value: any;
        pos: number;
    };
    _process_identifier(): {
        type: string;
        value: any;
        pos: number;
    };
    _skipnontokens(): void;
}
