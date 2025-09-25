select session_id, created_at, items
from checkout_bundles
where created_at >= '2025-01-01' and created_at < '2025-02-01'
order by created_at desc;
