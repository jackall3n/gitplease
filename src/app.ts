import minimist from 'minimist';

import {Checkout, Menu, Pull, PullRequest, Tag} from "./views";

interface IArgs {
    checkout: boolean;
    pullRequest: boolean;
    tags: boolean;
}

const args = process.argv.slice(2);

const minimistOptions: minimist.Opts = {
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
};

const options = minimist<IArgs>(args, minimistOptions);

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
