import {Git} from "../services/git";
import {Controller} from "../types/controller";

export class Pull extends Controller {
    public async run() {
        await Git.pull();
    }
}
