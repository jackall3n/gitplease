import * as minimist from 'minimist';

import {Menu, Checkout} from "./views";

interface IArgs {
    checkout: boolean;
}

const options = minimist<IArgs>(process.argv.slice(2), {});

class App {
    public async run() {
        let controller;

        if (options.checkout) {
            controller = new Checkout();
        }
        else {
            controller = new Menu();
        }

        return await controller.run();
    }
}

export default App;
