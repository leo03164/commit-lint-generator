/*
  Hook: trigger target hook
  Level [0..2]: 0 disables the rule. For 1 it will be considered a warning for 2 an error.
  Applicable always|never: never inverts the rule.
  Value: value to use for this rule.
*/

export const config = [
  {
    hook: "commit-msg",
    lang: "zh_tw",
    rules: [
      {
        name: "header-max-length",
        level: 2,
        applicable: "always",
        value: 50
      },
      {
        name: "body-full-stop",
        level: 2,
        applicable: "never",
        value: '.'
      },
      // {
      //   name: 'body-empty',
      //   level: 0,
      //   applicable: "never",
      // },
      // {
      //   name: 'footer-empty',
      //   level: 0,
      //   applicable: "never",
      // },
      {
        name: 'type-enum',
        level: 2,
        applicable: "always",
        value: [
          'Test',
          'Add',
          'Modify',
          'Refactor',
          'Remove',
          'Fix',
        ]
      },
      {
        name: 'type-case',
        level: 0,
        applicable: "always",
        value: 'pascal-case',
      },
      // {
      //   name: 'header-case',
      //   level: 0,
      //   applicable: "always",
      //   value: 'sentence-case',
      // },
      // {
      //   name: 'body-case',
      //   level: 0,
      //   applicable: "always",
      //   value: 'start-case',
      // },
      {
        name: 'header-full-stop',
        level: 2,
        applicable: "never",
        value: '.',
      },
      {
        name: "header-min-length",
        level: 2,
        applicable: "always",
        value: 4
      },
      {
        name: "header-trim",
        level: 2,
        applicable: "always",
      },
      {
        name: "body-max-line-length",
        level: 2,
        applicable: "always",
        value: 5
      },
      {
        name: "footer-max-line-length",
        level: 2,
        applicable: "always",
        value: 1
      },
      {
        name: "body-max-length",
        level: 2,
        applicable: "always",
        value: 72
      },
      {
        name: "footer-max-length",
        level: 2,
        applicable: "always",
        value: 72
      },
      // {
      //   name: "body-min-length",
      //   level: 0,
      //   applicable: "always",
      //   value: 10
      // },
      // {
      //   name: "footer-min-length",
      //   level: 0,
      //   applicable: "always",
      //   value: 3
      // },
    ]
  },
]