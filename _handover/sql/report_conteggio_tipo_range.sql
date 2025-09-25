with r as (
  select jsonb_array_elements(items::jsonb) as i
  from checkout_bundles
  where created_at >= '2025-01-01' and created_at < '2025-02-01'
)
select
  sum( (r.i->>'tipo') = 'single' )::int as singles,
  sum( (r.i->>'tipo') = 'multi'  )::int as multis;
