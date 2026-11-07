-- Allow a signed-in user to choose only their own public account role.
-- Admin is deliberately excluded and must be assigned by an administrator.
create or replace function public.set_my_initial_role(requested_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if requested_role not in ('tenant', 'landlord', 'caretaker') then
    raise exception 'Invalid account role';
  end if;

  update public.profiles
  set role = requested_role,
      updated_at = now()
  where id = auth.uid()
    and role <> 'admin';

  if not found then
    raise exception 'Profile not found or role cannot be changed';
  end if;
end;
$$;

revoke all on function public.set_my_initial_role(text) from public;
grant execute on function public.set_my_initial_role(text) to authenticated;
