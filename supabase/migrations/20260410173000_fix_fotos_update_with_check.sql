-- Recreate the storage update policy with an explicit WITH CHECK.
-- Use this if Supabase UI shows an empty WITH CHECK for fotos_update_own_or_admin.

drop policy if exists "fotos_update_own_or_admin" on storage.objects;

create policy "fotos_update_own_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'fotos'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
)
with check (
  bucket_id = 'fotos'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
);
