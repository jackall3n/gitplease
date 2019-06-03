import * as minimist from 'minimist';

import {Menu, Checkout, PullRequest, Tag, Pull} from "./views";

interface IArgs {
    checkout: boolean;
    pullRequest: boolean;
    tags: boolean;
}

const options = minimist<IArgs>(process.argv.slice(2), {
    boolean: ['checkout', 'pullRequest'],
    default: {
        checkout: false,
        pullRequest: false,
        tag: false,
        pull: false
    },
    alias: {
        c: 'checkout',
        pr: 'pullRequest',
        t: 'tag',
        p: 'pull'
    }
});

class App {
    public async run() {
        let controller;

        if (options.checkout) {
            controller = new Checkout();
        } else if (options.pullRequest) {
            controller = new PullRequest();
        } else if (options.tag) {
            controller = new Tag();
        } else if (options.pull) {
            controller = new Pull();
        } else {
            controller = new Menu();
        }

        return await controller.run();
    }
}

export default App;
