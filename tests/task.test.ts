import { Task } from '@core/types';
import { RawFile } from '../src/hooks/types';
import assert from 'assert';
import test, { describe, it } from "node:test";

/** Parse all occurance of task line in `file` content and then returns task list */
export function parseTasksFromFile(file: RawFile): Array<Task> {
    const tasks = file.content.reduce<Array<Task>>((acc, lineContent, index) => {
        const regex = /^- \[.\] .+/;

        if (lineContent.match(regex)) {
            acc.push({
                path: file.path,
                lineContent,
                lineNumber: index,
                body: lineContent,
            });
        }

        return acc;
    }, []);

    return tasks;
}

describe('parseTasksFromFile', () => {
  it('should return an empty array if no tasks are present', () => {
    const file: RawFile = {
      path: 'file.md',
      content: [
        'This is a line',
        'Another line',
        'Just text',
      ],
    };
    const result = parseTasksFromFile(file);
    assert.deepStrictEqual(result, []);
  });

  it('should parse single task line', () => {
    const file: RawFile = {
      path: 'tasks.md',
      content: [
        '- [ ] Task 1',
        'Some other text',
      ],
    };
    const result = parseTasksFromFile(file);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], {
      path: 'tasks.md',
      lineContent: '- [ ] Task 1',
      lineNumber: 0,
      body: '- [ ] Task 1',
    });
  });

  it('should parse multiple task lines', () => {
    const file: RawFile = {
      path: 'tasks.md',
      content: [
        '- [ ] Task 1',
        '- [x] Task 2',
        'Not a task',
        '- [ ] Task 3',
      ],
    };
    const result = parseTasksFromFile(file);
    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(result.map(t => t.lineContent), [
      '- [ ] Task 1',
      '- [x] Task 2',
      '- [ ] Task 3',
    ]);
  });

  it('should assign correct line numbers', () => {
    const file: RawFile = {
      path: 'tasks.md',
      content: [
        'Intro',
        '- [ ] Task 1',
        'Middle',
        '- [x] Task 2',
        '- [ ] Task 3',
      ],
    };
    const result = parseTasksFromFile(file);
    assert.strictEqual(result[0].lineNumber, 1);
    assert.strictEqual(result[1].lineNumber, 3);
    assert.strictEqual(result[2].lineNumber, 4);
  });
  it('should not parse task if empty line content', () => {
    const file: RawFile = {
      path: 'tasks.md',
      content: [
        '- [ ] Task 1',
        '',
        '- [ ]',
        'Not a task',
        '- [ ] Task 3',
      ],
    };
    const result = parseTasksFromFile(file);
    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(result.map(t => t.lineContent), [
      '- [ ] Task 1',
      '- [ ] Task 3',
    ]);
  });
});
