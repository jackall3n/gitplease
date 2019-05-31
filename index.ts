#! /usr/bin/env node

import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import {Question} from "inquirer";

const log = console.log;

const HOST_PATH = 'c:/windows/system32/drivers/etc/hosts';
const PATTERN = /^[\t ]*(?<local>[:\d.]+)[\t ]+(?<remote>[\w-.]+)[\t ]*(?:#[ ]*(?<comment>.*))?$/gm;

const menu = async () => {
    const VIEW_ENTRIES = 'view_entries';
    const ADD_ENTRY = 'add_entry';

    const {option} = await inquirer.prompt([{
        type: 'list',
        name: 'option',
        message: 'What do you want to do?',
        choices: [
            {name: 'View', value: VIEW_ENTRIES},
            {name: 'Add', value: ADD_ENTRY},
            new inquirer.Separator(),
            'Quit'
        ]
    }]);

    switch (option) {
        case VIEW_ENTRIES:
            return await view_entries();
        case ADD_ENTRY:
            return await add_entry();
    }
};

const view_entries = async () => {

    const hosts = fs.readFileSync(HOST_PATH, {encoding: 'UTF8'});

    const entries = [];

    let match;

    while ((match = PATTERN.exec(hosts)) != null) {
        const {local, remote, comment} = match.groups;

        entries.push({
            local,
            remote,
            comment
        });
    }

    for (const {local, remote, comment} of entries) {
        log(chalk`{blue ${local}}   {magenta ${remote.padEnd(50)}} {yellow ${comment ? comment : ""}}`)
    }
};

const add_entry = async () => {
    const local_question = {
        type: 'input',
        message: 'What is the local address?',
        name: 'local',
        default: '127.0.0.1',
        validate(input: any): boolean | string | Promise<boolean | string> {
            if (!input.length) {
                return 'A local address is required'
            }

            return true;
        }
    };

    const remote_question: Question = {
        type: 'input',
        message: 'What is the remote address?',
        name: 'remote',
        validate(input: any): boolean | string | Promise<boolean | string> {
            if (!input.length) {
                return 'A remote address is required'
            }

            return true;
        }
    };

    const comment_question = {
        type: 'input',
        message: 'What is the comment?',
        name: 'comment'
    };

    const {local, remote, comment} = await inquirer.prompt([local_question, remote_question, comment_question]);

    log(chalk`{blue ${local}}   {magenta ${remote.padEnd(50)}} {yellow ${comment ? comment : ""}}`);

    await add({local, remote, comment: comment.trim()});
};

const add = async ({local, remote, comment}) => {
    const {add} = await inquirer.prompt([{
        type: 'confirm',
        message: 'Are you sure you want to add this entry?',
        name: 'add'
    }]);

    if (add) {
        fs.appendFileSync(HOST_PATH, `\n${local}  ${remote}   ${comment ? `# ${comment}` : ""}`);
    }
};

menu().then();
