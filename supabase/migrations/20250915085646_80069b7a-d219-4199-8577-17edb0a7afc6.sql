-- Fix search_path for all remaining functions that don't have it set
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
 RETURNS user_role
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = user_uuid);
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_level()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.level = CASE
    WHEN NEW.points >= 5000 THEN 10
    WHEN NEW.points >= 4000 THEN 9
    WHEN NEW.points >= 3000 THEN 8
    WHEN NEW.points >= 2000 THEN 7
    WHEN NEW.points >= 1500 THEN 6
    WHEN NEW.points >= 1000 THEN 5
    WHEN NEW.points >= 700 THEN 4
    WHEN NEW.points >= 400 THEN 3
    WHEN NEW.points >= 200 THEN 2
    ELSE 1
  END;
  RETURN NEW;
END;
$function$;