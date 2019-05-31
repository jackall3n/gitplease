import {Git} from "../services/git";
import {Controller} from "../types/controller";

export class Branches extends Controller {

    public async run() {
        const branches = Git.branches();

        console.log(process.cwd());
    }
}
