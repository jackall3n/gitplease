import inquirer from "inquirer";
import chalk from 'chalk';
import _ from 'lodash';

import {Git} from "../services/git";
import {Controller} from "../types/controller";

const log = console.log;

const FEATURE_MATCH = /^Feature-Orion-(?<environment>\d{1,2})-(?<major>\d{1,2})\.(?<minor>\d{1,3})\.(?<build>\d+)\.(?<revision>\d+)$/;

interface ITag {
    tag: string;
    environment: number;
    version: {
        major: number;
        minor: number;
        build: number;
        revision: number;
    }
}

export class Tag extends Controller {

    private tagString(tag: ITag) {
        return [
            'Feature-Orion',
            tag.environment,
            [tag.version.major, tag.version.minor, tag.version.build, tag.version.revision].join('.')
        ].join('-');
    }

    public async run() {
        const {all} = await Git.tags();

        const tags = _(all)
            .filter(tag => !!tag.match(FEATURE_MATCH))
            .map(tag => {
                const {environment, major, minor, build, revision} = tag.match(FEATURE_MATCH)!.groups as any;

                return {
                    tag,
                    environment: parseInt(environment),
                    version: {
                        major: parseInt(major),
                        minor: parseInt(minor),
                        build: parseInt(build),
                        revision: parseInt(revision)
                    }
                }
            })
            .orderBy(
                [
                    tag => tag.environment,
                    tag => tag.version.major,
                    tag => tag.version.minor,
                    tag => tag.version.build,
                    tag => tag.version.revision,
                ],
                [
                    'asc',
                    'desc',
                    'desc',
                    'desc',
                    'desc'
                ])
            .take(4)
            .value();

        const current = tags[0];
        const suggested = _.cloneDeep(current);
        suggested.version.build++;

        const suggestedTag = this.tagString(suggested);

        log(chalk.grey(tags[3].tag));
        log(chalk.grey(tags[2].tag));
        log(chalk.grey(tags[1].tag));
        log(chalk.green(`${current.tag} <- CURRENT`));
        log(chalk.blue(`${suggestedTag} <- SUGGESTED`));

        const {create, push} = await inquirer.prompt([{
            type: "input",
            message: "What tag do you want to create?",
            name: 'tagName',
            default: suggestedTag,
            validate(tagName: string) {
                if (!tagName.match(FEATURE_MATCH)) {
                    return "Invalid version, please follow the format `Feature-Orion-{ENV}-{MAJOR}.{MINOR}.{BUILD}.{REVISION}`"
                }

                return true;
            }
        }, {
            type: 'confirm',
            message: "Shall I push?",
            name: 'push'
        }]);

        if (!create) {
            return;
        }

        await Git.tag(suggestedTag);

        log(chalk`Successfully tagged {green ${suggestedTag}}`);

        if (!push) {
            return;
        }

        log("Pushing to remote...");
        await Git.pushTags();
        log("Successfully pushed tags to remote");
    }
}
