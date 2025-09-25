with r as (
  select jsonb_array_elements(items::jsonb) as i
  from checkout_bundles
  where created_at >= now() - interval '30 days'
)
select
  sum( (r.i->>'tipo') = 'single' )::int as singles,
  sum( (r.i->>'tipo') = 'multi'  )::int as multis;
