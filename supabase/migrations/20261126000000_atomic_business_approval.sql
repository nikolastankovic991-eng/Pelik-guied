-- Atomic administrator approval for business applications.
-- This migration targets the live schema documented in the repository README.
create or replace function public.admin_approve_business_submission(p_submission_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_submission public.business_submissions%rowtype;
  v_business_id uuid;
begin
  if auth.uid() is null or not exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  ) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  select * into v_submission
  from public.business_submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'Business application not found' using errcode = 'P0002';
  end if;

  if v_submission.status <> 'pending' or v_submission.published then
    raise exception 'This application has already been processed' using errcode = '55000';
  end if;

  if v_submission.category <> all (array[
    'Restaurants & Cafés','Bars, Pubs & Nightlife','Bakeries, Butchers & Fishmongers','Supermarkets & Food Stores',
    'Diving & Water Sports','Tours, Guides & Excursions','Activities & Attractions','Arts, Culture & Entertainment',
    'Car Rental','Scooter, Quad & Motorcycle Rental','Bicycle & E-bike Rental','Boat Rental & Charters','Taxi, Transfers & Minibus',
    'Shopping & Retail','Clothing, Shoes & Accessories','Phone Shops & Mobile Accessories','Computers, IT & Electronics','Local Products, Farms & Crafts',
    'Pharmacies & Medical','Doctors, Dentists & Clinics','Hairdressers, Barbers & Beauty','Gyms, Sports & Wellness','Pets & Veterinary',
    'Property & Real Estate','Hardware, DIY & Building Supplies','Home, Garden & Furniture','Repairs, Trades & Maintenance','Cleaning & Laundry',
    'Professional & Business Services','Education & Childcare','Wedding & Event Services','Community & Public Services','Other local service'
  ]::text[]) then
    raise exception 'This category is not approved for public listings' using errcode = '22023';
  end if;

  insert into public.businesses (
    business_name, category, village, address, phone, email, website, description, image_url,
    status, published, featured, updated_at
  ) values (
    v_submission.business_name, v_submission.category, v_submission.village, v_submission.address,
    v_submission.phone, v_submission.email, v_submission.website, v_submission.description, v_submission.image_url,
    'approved', true, false, now()
  ) returning id into v_business_id;

  update public.business_submissions
  set status = 'approved', published = true
  where id = v_submission.id;

  return v_business_id;
end;
$$;

revoke all on function public.admin_approve_business_submission(uuid) from public;
grant execute on function public.admin_approve_business_submission(uuid) to authenticated;
