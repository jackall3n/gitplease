import * as sh from 'shelljs';

export class Git {
    static branches() {
        console.log(sh.exec('git branches'));
    }
}
