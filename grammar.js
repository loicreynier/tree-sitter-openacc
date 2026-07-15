/**
 * @file OpenACC grammar for tree-sitter
 * @author Loïc Reynier <contact@loicreynier.>
 * @license Unlicense
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  CLAUSE: 1,
};

module.exports = grammar({
  name: 'openacc',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => optional($._directive),

    _directive: $ => choice(
      $.parallel_directive,
      $.kernels_directive,
      $.parallel_loop_directive,
      $.kernels_loop_directive,
      $.loop_directive,
      $.data_directive,
      $.enter_data_directive,
      $.exit_data_directive,
      $.host_data_directive,
      $.update_directive,
      $.wait_directive,
      $.routine_directive,
      $.declare_directive,
      $.atomic_directive,
      $.cache_directive,
      $.end_directive,
    ),

    // -- Directives

    parallel_directive: $ => seq('parallel', repeat($.clause)),

    kernels_directive: $ => seq('kernels', repeat($.clause)),

    parallel_loop_directive: $ => seq('parallel', 'loop', repeat($.clause)),

    kernels_loop_directive: $ => seq('kernels', 'loop', repeat($.clause)),

    loop_directive: $ => seq('loop', repeat($.clause)),

    data_directive: $ => seq('data', repeat($.clause)),

    enter_data_directive: $ => seq('enter', 'data', repeat($.clause)),

    exit_data_directive: $ => seq('exit', 'data', repeat($.clause)),

    host_data_directive: $ => seq('host_data', repeat($.host_data_clause)),

    update_directive: $ => seq('update', repeat($.clause)),

    wait_directive: $ => seq('wait', optional($.wait_argument), repeat($.clause)),

    wait_argument: $ => seq('(', commaSep1($.expression), ')'),

    routine_directive: $ => seq('routine', optional(seq('(', $.identifier, ')')), repeat($.clause)),

    declare_directive: $ => seq('declare', repeat($.clause)),

    atomic_directive: $ => seq('atomic', optional(choice('read', 'write', 'update', 'capture'))),

    cache_directive: $ => seq('cache', '(', commaSep1($.identifier), ')'),

    end_directive: $ => seq(
      'end',
      choice(
        'parallel',
        'kernels',
        'data',
        'host_data',
        seq('parallel', 'loop'),
        seq('kernels', 'loop'),
      ),
    ),

    // -- Clauses

    clause: $ => prec(PREC.CLAUSE, choice(
      $.if_clause,
      $.async_clause,
      $.num_gangs_clause,
      $.num_workers_clause,
      $.vector_length_clause,
      $.gang_clause,
      $.worker_clause,
      $.vector_clause,
      $.private_clause,
      $.firstprivate_clause,
      $.reduction_clause,
      $.copy_clause,
      $.copyin_clause,
      $.copyout_clause,
      $.create_clause,
      $.present_clause,
      $.default_clause,
      $.collapse_clause,
      $.seq_clause,
      $.independent_clause,
      $.auto_clause,
      $.host_clause,
      $.device_clause,
      $.device_type_clause,
      $.use_device_clause,
    )),

    if_clause: $ => seq('if', '(', $.expression, ')'),

    async_clause: $ => seq('async', optional(seq('(', $.expression, ')'))),

    num_gangs_clause: $ => seq('num_gangs', '(', $.expression, ')'),
    num_workers_clause: $ => seq('num_workers', '(', $.expression, ')'),
    vector_length_clause: $ => seq('vector_length', '(', $.expression, ')'),

    gang_clause: $ => seq(
      'gang',
      optional(seq('(', commaSep1($.gang_arg), ')')),
    ),
    gang_arg: $ => choice(
      $.expression,
      seq('num', ':', $.expression),
      seq('static', ':', choice($.expression, '*')),
    ),

    worker_clause: $ => seq(
      'worker',
      optional(seq('(', $.expression, ')')),
    ),

    vector_clause: $ => seq(
      'vector',
      optional(seq('(', $.expression, ')')),
    ),

    collapse_clause: $ => seq('collapse', '(', $.number, ')'),

    private_clause: $ => seq('private', '(', commaSep1($.identifier), ')'),

    firstprivate_clause: $ => seq('firstprivate', '(', commaSep1($.identifier), ')'),

    reduction_clause: $ => seq(
      'reduction', '(',
      field('operator', $.reduction_operator),
      ':',
      commaSep1($.identifier),
      ')',
    ),

    reduction_operator: _ => choice(
      '+', '*', 'max', 'min', '&&', '||', '.and.', '.or.', '.eqv.', '.neqv.',
    ),

    copy_clause: $ => seq('copy', '(', commaSep1($.var_ref), ')'),
    copyin_clause: $ => seq('copyin', '(', commaSep1($.var_ref), ')'),
    copyout_clause: $ => seq('copyout', '(', commaSep1($.var_ref), ')'),
    create_clause: $ => seq('create', '(', commaSep1($.var_ref), ')'),
    present_clause: $ => seq('present', '(', commaSep1($.var_ref), ')'),

    default_clause: $ => seq('default', '(', choice('none', 'present'), ')'),

    seq_clause: _ => 'seq',
    independent_clause: _ => 'independent',
    auto_clause: _ => 'auto',

    host_clause: $ => seq(choice('host', 'self'), optional(seq('(', $.expression, ')'))),
    device_clause: $ => seq('device', optional(seq('(', $.expression, ')'))),

    device_type_clause: $ => seq(
      choice('device_type', 'dtype'),
      '(', commaSep1(choice($.identifier, '*')), ')',
    ),

    host_data_clause: $ => choice(
      $.use_device_clause,
      $.if_clause,
      $.if_present_clause,
    ),

    use_device_clause: $ => seq(
      'use_device', '(', commaSep1($.identifier), ')',
    ),

    if_present_clause: _ => 'if_present',

    // -- Variables: copy(a(1:n))
    // TODO: support for C syntax: copy(a[0:n]) ?

    var_ref: $ => seq($.identifier, optional($.subscript_range)),

    subscript_range: $ => seq('(', commaSep1($.range_spec), ')'),

    range_spec: $ => choice(
      $.expression,
      seq(optional($.expression), ':', optional($.expression)),
    ),

    // -- Base expression

    expression: $ => choice(
      $.identifier,
      $.number,
      $.binary_expression,
      $.parenthesized_expression,
    ),

    parenthesized_expression: $ => seq('(', $.expression, ')'),

    binary_expression: $ => choice(
      ...[
        ['+', 10], ['-', 10],
        ['*', 11], ['/', 11],
        ['>', 8], ['<', 8], ['>=', 8], ['<=', 8], ['==', 7], ['/=', 7],
      ].map(([op, p]) => prec.left(p, seq(
        $.expression, op, $.expression,
      ))),
    ),

    // -- Primitives

    identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: _ => /\d+(\.\d+)?/,

    // TODO: support for other than Fortran ?
    comment: _ => token(seq('!', /[^\n]*/)),
  },
});

/**
 * Creates a rule to match one or more of the rules separated by a comma
 *
 * @param {Rule} rule
 *
 * @returns {SeqRule}
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

// /**
//  * Creates a rule to optionally match one or more of the rules separated by a comma
//  *
//  * @param {Rule} rule
//  *
//  * @returns {ChoiceRule}
//  */
// function commaSep(rule) {
//   return optional(commaSep1(rule));
// }
