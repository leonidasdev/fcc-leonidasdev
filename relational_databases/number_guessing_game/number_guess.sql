--
-- PostgreSQL database dump
--

-- Dumped from database version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)
-- Dumped by pg_dump version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE number_guess;
--
-- Name: number_guess; Type: DATABASE; Schema: -; Owner: freecodecamp
--

CREATE DATABASE number_guess WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE number_guess OWNER TO freecodecamp;

\connect number_guess

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: games; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.games (
    game_id integer NOT NULL,
    user_id integer,
    guesses integer NOT NULL,
    secret_number integer NOT NULL,
    played_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT games_guesses_check CHECK ((guesses > 0)),
    CONSTRAINT games_secret_number_check CHECK (((secret_number >= 1) AND (secret_number <= 1000)))
);


ALTER TABLE public.games OWNER TO freecodecamp;

--
-- Name: games_game_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.games_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.games_game_id_seq OWNER TO freecodecamp;

--
-- Name: games_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.games_game_id_seq OWNED BY public.games.game_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(22) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO freecodecamp;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO freecodecamp;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: games game_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.games ALTER COLUMN game_id SET DEFAULT nextval('public.games_game_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.games VALUES (1, 1, 319, 318, '2026-02-08 04:47:11.257551');
INSERT INTO public.games VALUES (2, 2, 241, 240, '2026-02-08 04:47:11.741728');
INSERT INTO public.games VALUES (3, 1, 440, 437, '2026-02-08 04:47:11.961605');
INSERT INTO public.games VALUES (4, 1, 582, 580, '2026-02-08 04:47:12.217457');
INSERT INTO public.games VALUES (5, 1, 600, 599, '2026-02-08 04:47:12.459304');
INSERT INTO public.games VALUES (6, 3, 612, 611, '2026-02-08 04:48:49.573496');
INSERT INTO public.games VALUES (7, 4, 326, 325, '2026-02-08 04:48:49.984666');
INSERT INTO public.games VALUES (8, 3, 162, 159, '2026-02-08 04:48:50.175641');
INSERT INTO public.games VALUES (9, 3, 476, 474, '2026-02-08 04:48:50.377956');
INSERT INTO public.games VALUES (10, 3, 965, 964, '2026-02-08 04:48:50.60693');
INSERT INTO public.games VALUES (11, 5, 400, 399, '2026-02-08 04:49:40.586913');
INSERT INTO public.games VALUES (12, 6, 397, 396, '2026-02-08 04:49:41.129057');
INSERT INTO public.games VALUES (13, 5, 739, 736, '2026-02-08 04:49:41.426653');
INSERT INTO public.games VALUES (14, 5, 467, 465, '2026-02-08 04:49:41.716876');
INSERT INTO public.games VALUES (15, 5, 350, 349, '2026-02-08 04:49:41.988416');
INSERT INTO public.games VALUES (16, 8, 602, 601, '2026-02-08 04:52:30.84173');
INSERT INTO public.games VALUES (17, 8, 417, 416, '2026-02-08 04:52:31.109617');
INSERT INTO public.games VALUES (18, 9, 32, 31, '2026-02-08 04:52:31.348595');
INSERT INTO public.games VALUES (19, 9, 248, 247, '2026-02-08 04:52:31.61053');
INSERT INTO public.games VALUES (20, 8, 102, 99, '2026-02-08 04:52:31.871533');
INSERT INTO public.games VALUES (21, 8, 268, 266, '2026-02-08 04:52:32.133369');
INSERT INTO public.games VALUES (22, 8, 755, 754, '2026-02-08 04:52:32.422956');
INSERT INTO public.games VALUES (23, 10, 504, 503, '2026-02-08 04:53:34.593308');
INSERT INTO public.games VALUES (24, 10, 350, 349, '2026-02-08 04:53:34.861463');
INSERT INTO public.games VALUES (25, 11, 182, 181, '2026-02-08 04:53:35.114535');
INSERT INTO public.games VALUES (26, 11, 917, 916, '2026-02-08 04:53:35.43098');
INSERT INTO public.games VALUES (27, 10, 187, 184, '2026-02-08 04:53:35.690787');
INSERT INTO public.games VALUES (28, 10, 52, 50, '2026-02-08 04:53:35.952278');
INSERT INTO public.games VALUES (29, 10, 264, 263, '2026-02-08 04:53:36.237379');
INSERT INTO public.games VALUES (30, 12, 714, 713, '2026-02-08 04:53:49.303782');
INSERT INTO public.games VALUES (31, 12, 395, 394, '2026-02-08 04:53:49.594986');
INSERT INTO public.games VALUES (32, 13, 888, 887, '2026-02-08 04:53:49.998976');
INSERT INTO public.games VALUES (33, 13, 662, 661, '2026-02-08 04:53:50.29693');
INSERT INTO public.games VALUES (34, 12, 720, 717, '2026-02-08 04:53:50.601222');
INSERT INTO public.games VALUES (35, 12, 127, 125, '2026-02-08 04:53:50.873635');
INSERT INTO public.games VALUES (36, 12, 853, 852, '2026-02-08 04:53:51.174094');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.users VALUES (1, 'user_1770544030474', '2026-02-08 04:47:10.992698');
INSERT INTO public.users VALUES (2, 'user_1770544030473', '2026-02-08 04:47:11.444896');
INSERT INTO public.users VALUES (3, 'user_1770544129111', '2026-02-08 04:48:49.32034');
INSERT INTO public.users VALUES (4, 'user_1770544129110', '2026-02-08 04:48:49.750534');
INSERT INTO public.users VALUES (5, 'user_1770544180065', '2026-02-08 04:49:40.24913');
INSERT INTO public.users VALUES (6, 'user_1770544180064', '2026-02-08 04:49:40.765828');
INSERT INTO public.users VALUES (7, 'Lee', '2026-02-08 04:50:06.987058');
INSERT INTO public.users VALUES (8, 'user_1770544350509', '2026-02-08 04:52:30.731218');
INSERT INTO public.users VALUES (9, 'user_1770544350508', '2026-02-08 04:52:31.280013');
INSERT INTO public.users VALUES (10, 'user_1770544414294', '2026-02-08 04:53:34.488918');
INSERT INTO public.users VALUES (11, 'user_1770544414293', '2026-02-08 04:53:35.033226');
INSERT INTO public.users VALUES (12, 'user_1770544428999', '2026-02-08 04:53:49.19004');
INSERT INTO public.users VALUES (13, 'user_1770544428998', '2026-02-08 04:53:49.819874');


--
-- Name: games_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.games_game_id_seq', 36, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.users_user_id_seq', 13, true);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: games games_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

