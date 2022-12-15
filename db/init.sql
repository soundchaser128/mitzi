CREATE TABLE public.commission_sheet (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    template_type character varying NOT NULL,
    artist_name character varying NOT NULL UNIQUE,
    rules character varying[] NOT NULL,
    currency character varying NOT NULL,
    background_color character varying NOT NULL,
    text_color character varying NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users (id)
);

CREATE TABLE public.commission_tier (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sheet_id bigint NOT NULL REFERENCES commission_sheet (id),
    name character varying NOT NULL,
    price double precision NOT NULL,
    image_url character varying NOT NULL,
    info_lines character varying[] NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users (id)
);

CREATE TABLE public.social_link (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sheet_id bigint NOT NULL REFERENCES commission_sheet (id),
    link_type character varying NOT NULL,
    url character varying NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users (id)
);
