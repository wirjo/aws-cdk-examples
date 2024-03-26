import {
    sql,
    createPgStatement,
    toJsonObject,
    typeHint,
  } from '@aws-appsync/utils/rds';
  
  export function request(ctx) {
    const query = sql`
  SELECT
      c.id AS id,
      COUNT(DISTINCT m.id) AS total_messages,
      COUNT(DISTINCT cp.sub) AS total_participants,
      SUM(LENGTH(m.body) - LENGTH(REPLACE(m.body, ' ', '')) + 1) AS total_words
  FROM
      conversations c
  LEFT JOIN
      messages m ON c.id = m.conversation_id
  LEFT JOIN
      conversation_participants cp ON c.id = cp.conversation_id
  WHERE
      c.id = ${ctx.args.id}
      AND m.created_at >= ${typeHint.DATE(ctx.args.since)}
  GROUP BY
      c.id, c.name;
  `;
    return createPgStatement(query);
  }
  
  export function response(ctx) {
    return toJsonObject(ctx.result)[0][0];
  }