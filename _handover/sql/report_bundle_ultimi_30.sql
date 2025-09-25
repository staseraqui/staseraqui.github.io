select session_id, created_at, items
from checkout_bundles
where created_at >= now() - interval '30 days'
order by created_at desc;
