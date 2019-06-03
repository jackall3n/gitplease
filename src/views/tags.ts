import * as inquirer from "inquirer";
import * as open from 'open';
import * as _ from 'lodash';

import {Git} from "../services/git";
import {Controller} from "../types/controller";

const FEATURE_MATCH = /^Feature-Orion-(?<environment>\d{1,2})-(?<major>\d{1,2})\.(?<minor>\d{1,3})\.(?<build>\d+)\.(?<revision>\d+)$/;

export class Tags extends Controller {

    public async run() {
        const {latest, all} = await Git.tags();

        const tags = _(all)
            .filter(tag => !!tag.match(FEATURE_MATCH))
            .map(tag => {
                const {environment, major, minor, build, revision} = tag.match(FEATURE_MATCH).groups;

                return {
                    tag,
                    environment: parseInt(environment),
                    major: parseInt(major),
                    minor: parseInt(minor),
                    build: parseInt(build),
                    revision: parseInt(revision),
                }
            })
            .orderBy(['environment', 'major', 'minor', 'build', 'revision'], ['asc', 'desc', 'desc', 'desc', 'desc'])
            .take(5)
            .value();

        console.log(tags);
    }
}
