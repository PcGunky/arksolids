-- Update the collections policy to allow anyone to view collections
drop policy if exists "Users can view their own collections" on collections;

create policy "Anyone can view collections"
  on collections for select
  to anon, authenticated
  using (true);

-- Keep the existing insert and update policies