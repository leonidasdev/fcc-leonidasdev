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

DROP DATABASE universe;
--
-- Name: universe; Type: DATABASE; Schema: -; Owner: freecodecamp
--

CREATE DATABASE universe WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE universe OWNER TO freecodecamp;

\connect universe

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
-- Name: comet; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.comet (
    comet_id integer NOT NULL,
    name character varying(100) NOT NULL,
    orbital_period_years numeric(10,2) NOT NULL,
    nucleus_diameter_km integer NOT NULL,
    is_periodic boolean DEFAULT true NOT NULL
);


ALTER TABLE public.comet OWNER TO freecodecamp;

--
-- Name: comet_comet_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.comet_comet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comet_comet_id_seq OWNER TO freecodecamp;

--
-- Name: comet_comet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.comet_comet_id_seq OWNED BY public.comet.comet_id;


--
-- Name: galaxy; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.galaxy (
    galaxy_id integer NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(50) NOT NULL,
    distance_light_years integer NOT NULL,
    description text,
    has_life boolean DEFAULT false NOT NULL
);


ALTER TABLE public.galaxy OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.galaxy_galaxy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.galaxy_galaxy_id_seq OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.galaxy_galaxy_id_seq OWNED BY public.galaxy.galaxy_id;


--
-- Name: moon; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.moon (
    moon_id integer NOT NULL,
    name character varying(100) NOT NULL,
    planet_id integer NOT NULL,
    radius_km integer NOT NULL,
    is_tidally_locked boolean DEFAULT true NOT NULL,
    surface_composition text
);


ALTER TABLE public.moon OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.moon_moon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moon_moon_id_seq OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.moon_moon_id_seq OWNED BY public.moon.moon_id;


--
-- Name: planet; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.planet (
    planet_id integer NOT NULL,
    name character varying(100) NOT NULL,
    star_id integer NOT NULL,
    has_life boolean DEFAULT false NOT NULL,
    has_rings boolean DEFAULT false NOT NULL,
    radius_km integer NOT NULL,
    mass_earth numeric(10,2) NOT NULL
);


ALTER TABLE public.planet OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.planet_planet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planet_planet_id_seq OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.planet_planet_id_seq OWNED BY public.planet.planet_id;


--
-- Name: star; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.star (
    star_id integer NOT NULL,
    name character varying(100) NOT NULL,
    galaxy_id integer NOT NULL,
    spectral_type character varying(20) NOT NULL,
    mass_solar numeric(10,2) NOT NULL,
    is_main_sequence boolean DEFAULT true NOT NULL
);


ALTER TABLE public.star OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.star_star_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.star_star_id_seq OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.star_star_id_seq OWNED BY public.star.star_id;


--
-- Name: comet comet_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.comet ALTER COLUMN comet_id SET DEFAULT nextval('public.comet_comet_id_seq'::regclass);


--
-- Name: galaxy galaxy_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy ALTER COLUMN galaxy_id SET DEFAULT nextval('public.galaxy_galaxy_id_seq'::regclass);


--
-- Name: moon moon_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon ALTER COLUMN moon_id SET DEFAULT nextval('public.moon_moon_id_seq'::regclass);


--
-- Name: planet planet_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet ALTER COLUMN planet_id SET DEFAULT nextval('public.planet_planet_id_seq'::regclass);


--
-- Name: star star_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star ALTER COLUMN star_id SET DEFAULT nextval('public.star_star_id_seq'::regclass);


--
-- Data for Name: comet; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.comet VALUES (1, 'Halley', 75.30, 11, true);
INSERT INTO public.comet VALUES (2, 'Hale-Bopp', 2533.00, 60, true);
INSERT INTO public.comet VALUES (3, 'Encke', 3.30, 4, true);


--
-- Data for Name: galaxy; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.galaxy VALUES (1, 'Milky Way', 'Spiral', 0, 'Our home galaxy', true);
INSERT INTO public.galaxy VALUES (2, 'Andromeda', 'Spiral', 2537000, 'Nearest major galaxy', false);
INSERT INTO public.galaxy VALUES (3, 'Triangulum', 'Spiral', 3000000, 'Small spiral galaxy', false);
INSERT INTO public.galaxy VALUES (4, 'Sombrero', 'Spiral', 29000000, 'Bright nucleus and dust lane', false);
INSERT INTO public.galaxy VALUES (5, 'Whirlpool', 'Spiral', 23000000, 'Interacting grand-design spiral', false);
INSERT INTO public.galaxy VALUES (6, 'Large Magellanic Cloud', 'Irregular', 163000, 'Satellite galaxy of the Milky Way', false);


--
-- Data for Name: moon; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.moon VALUES (1, 'Moon', 3, 1737, true, 'Rocky, regolith');
INSERT INTO public.moon VALUES (2, 'Phobos', 4, 11, true, 'Rocky');
INSERT INTO public.moon VALUES (3, 'Deimos', 4, 6, true, 'Rocky');
INSERT INTO public.moon VALUES (4, 'Io', 5, 1821, true, 'Volcanic');
INSERT INTO public.moon VALUES (5, 'Europa', 5, 1560, true, 'Ice, rock');
INSERT INTO public.moon VALUES (6, 'Ganymede', 5, 2634, true, 'Ice, rock');
INSERT INTO public.moon VALUES (7, 'Callisto', 5, 2410, true, 'Ice, rock');
INSERT INTO public.moon VALUES (8, 'Mimas', 6, 198, true, 'Ice');
INSERT INTO public.moon VALUES (9, 'Enceladus', 6, 252, true, 'Ice, subsurface ocean');
INSERT INTO public.moon VALUES (10, 'Tethys', 6, 531, true, 'Ice');
INSERT INTO public.moon VALUES (11, 'Dione', 6, 561, true, 'Ice');
INSERT INTO public.moon VALUES (12, 'Rhea', 6, 764, true, 'Ice');
INSERT INTO public.moon VALUES (13, 'Titan', 6, 2575, true, 'Nitrogen atmosphere');
INSERT INTO public.moon VALUES (14, 'Iapetus', 6, 735, true, 'Ice, dark material');
INSERT INTO public.moon VALUES (15, 'Proxima b Moon 1', 7, 800, true, 'Rocky');
INSERT INTO public.moon VALUES (16, 'Sirius Planet 1 Moon 1', 8, 900, true, 'Rocky');
INSERT INTO public.moon VALUES (17, 'Andromeda Planet 1 Moon 1', 9, 700, true, 'Rocky');
INSERT INTO public.moon VALUES (18, 'Andromeda Planet 2 Moon 1', 10, 600, true, 'Rocky');
INSERT INTO public.moon VALUES (19, 'Triangulum Planet 1 Moon 1', 11, 500, true, 'Rocky');
INSERT INTO public.moon VALUES (20, 'Whirlpool Planet 1 Moon 1', 12, 400, true, 'Rocky');


--
-- Data for Name: planet; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.planet VALUES (1, 'Mercury', 1, false, false, 2440, 0.06);
INSERT INTO public.planet VALUES (2, 'Venus', 1, false, false, 6052, 0.82);
INSERT INTO public.planet VALUES (3, 'Earth', 1, true, false, 6371, 1.00);
INSERT INTO public.planet VALUES (4, 'Mars', 1, false, false, 3390, 0.11);
INSERT INTO public.planet VALUES (5, 'Jupiter', 1, false, true, 69911, 317.80);
INSERT INTO public.planet VALUES (6, 'Saturn', 1, false, true, 58232, 95.16);
INSERT INTO public.planet VALUES (7, 'Proxima b', 2, false, false, 7000, 1.30);
INSERT INTO public.planet VALUES (8, 'Sirius Planet 1', 3, false, true, 15000, 5.00);
INSERT INTO public.planet VALUES (9, 'Andromeda Planet 1', 4, false, false, 8000, 2.10);
INSERT INTO public.planet VALUES (10, 'Andromeda Planet 2', 4, false, false, 9000, 3.00);
INSERT INTO public.planet VALUES (11, 'Triangulum Planet 1', 5, false, false, 7000, 1.50);
INSERT INTO public.planet VALUES (12, 'Whirlpool Planet 1', 6, false, true, 12000, 4.20);


--
-- Data for Name: star; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.star VALUES (1, 'Sun', 1, 'G2V', 1.00, true);
INSERT INTO public.star VALUES (2, 'Proxima Centauri', 1, 'M5.5Ve', 0.12, true);
INSERT INTO public.star VALUES (3, 'Sirius A', 1, 'A1V', 2.02, true);
INSERT INTO public.star VALUES (4, 'Andromeda Star A', 2, 'G0V', 1.10, true);
INSERT INTO public.star VALUES (5, 'Triangulum Star A', 3, 'K2V', 0.80, true);
INSERT INTO public.star VALUES (6, 'Whirlpool Star A', 5, 'F5V', 1.40, true);


--
-- Name: comet_comet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.comet_comet_id_seq', 3, true);


--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.galaxy_galaxy_id_seq', 6, true);


--
-- Name: moon_moon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.moon_moon_id_seq', 20, true);


--
-- Name: planet_planet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.planet_planet_id_seq', 12, true);


--
-- Name: star_star_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.star_star_id_seq', 6, true);


--
-- Name: comet comet_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.comet
    ADD CONSTRAINT comet_name_key UNIQUE (name);


--
-- Name: comet comet_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.comet
    ADD CONSTRAINT comet_pkey PRIMARY KEY (comet_id);


--
-- Name: galaxy galaxy_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_name_key UNIQUE (name);


--
-- Name: galaxy galaxy_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_pkey PRIMARY KEY (galaxy_id);


--
-- Name: moon moon_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_name_key UNIQUE (name);


--
-- Name: moon moon_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_pkey PRIMARY KEY (moon_id);


--
-- Name: planet planet_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_name_key UNIQUE (name);


--
-- Name: planet planet_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_pkey PRIMARY KEY (planet_id);


--
-- Name: star star_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_name_key UNIQUE (name);


--
-- Name: star star_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_pkey PRIMARY KEY (star_id);


--
-- Name: moon moon_planet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_planet_id_fkey FOREIGN KEY (planet_id) REFERENCES public.planet(planet_id);


--
-- Name: planet planet_star_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_star_id_fkey FOREIGN KEY (star_id) REFERENCES public.star(star_id);


--
-- Name: star star_galaxy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_galaxy_id_fkey FOREIGN KEY (galaxy_id) REFERENCES public.galaxy(galaxy_id);


--
-- PostgreSQL database dump complete
--