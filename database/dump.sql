--
-- PostgreSQL database dump
--

-- Dumped from database version 13.0
-- Dumped by pg_dump version 13.0

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

--
-- Name: get_branches(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_branches() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
        x char(10);
        council_ids char(10) array;
        branch_ids char(8) array;
    BEGIN
        council_ids := (select array_agg(council_id) from council);
        foreach x in ARRAY council_ids
        loop
            branch_ids := (select array_agg(branch_id) from council_branch where council_id=x);
            raise notice '%', branch_ids;
        end loop;
    end
$$;


ALTER FUNCTION public.get_branches() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: applicant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applicant (
    applicant_id integer NOT NULL,
    council_id character(10) NOT NULL,
    surname character varying(30) NOT NULL,
    name character varying(60) NOT NULL,
    abstract character varying(150) NOT NULL,
    degree character varying(150) NOT NULL
);


ALTER TABLE public.applicant OWNER TO postgres;

--
-- Name: applicant_applicant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applicant_applicant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.applicant_applicant_id_seq OWNER TO postgres;

--
-- Name: applicant_applicant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applicant_applicant_id_seq OWNED BY public.applicant.applicant_id;


--
-- Name: b_passport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b_passport (
    b_passport_id integer NOT NULL,
    branch_id character(8) NOT NULL,
    definition text NOT NULL,
    research text NOT NULL,
    differentiation text
);


ALTER TABLE public.b_passport OWNER TO postgres;

--
-- Name: b_passport_b_passport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.b_passport_b_passport_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.b_passport_b_passport_id_seq OWNER TO postgres;

--
-- Name: b_passport_b_passport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.b_passport_b_passport_id_seq OWNED BY public.b_passport.b_passport_id;


--
-- Name: b_passport_branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b_passport_branch (
    b_passport_id integer NOT NULL,
    branch_id character(8) NOT NULL
);


ALTER TABLE public.b_passport_branch OWNER TO postgres;

--
-- Name: branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branch (
    branch_id character(8) NOT NULL,
    name character varying(180),
    bg_id character(8) NOT NULL
);


ALTER TABLE public.branch OWNER TO postgres;

--
-- Name: branch_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branch_group (
    bg_id character(8) NOT NULL,
    name character varying(70) NOT NULL,
    science_id character(8) NOT NULL
);


ALTER TABLE public.branch_group OWNER TO postgres;

--
-- Name: branch_science; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branch_science (
    branch_id character(8) NOT NULL,
    science_id character(8) NOT NULL
);


ALTER TABLE public.branch_science OWNER TO postgres;

--
-- Name: council; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.council (
    council_id character(10) NOT NULL,
    creation_date date NOT NULL,
    expiration_date date NOT NULL,
    org_id integer NOT NULL,
    phone character(9) NOT NULL,
    CONSTRAINT council_check CHECK (((date_part('epoch'::text, expiration_date) - date_part('epoch'::text, creation_date)) > (0)::double precision))
);


ALTER TABLE public.council OWNER TO postgres;

--
-- Name: council_branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.council_branch (
    council_id character(10) NOT NULL,
    branch_id character(8) NOT NULL
);


ALTER TABLE public.council_branch OWNER TO postgres;

--
-- Name: dissertation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dissertation (
    dissertation_id integer NOT NULL,
    applicant_id integer NOT NULL,
    theme character(200) NOT NULL,
    deadline_date timestamp with time zone,
    science_id character(8) NOT NULL,
    classroom character varying(40)
);


ALTER TABLE public.dissertation OWNER TO postgres;

--
-- Name: dissertation_branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dissertation_branch (
    dissertation_id integer NOT NULL,
    branch_id character(8) NOT NULL
);


ALTER TABLE public.dissertation_branch OWNER TO postgres;

--
-- Name: dissertation_dissertation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dissertation_dissertation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dissertation_dissertation_id_seq OWNER TO postgres;

--
-- Name: dissertation_dissertation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dissertation_dissertation_id_seq OWNED BY public.dissertation.dissertation_id;


--
-- Name: member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member (
    council_id character(10) NOT NULL,
    member_id integer NOT NULL,
    surname character varying(30) NOT NULL,
    name character varying(60) NOT NULL,
    post character varying(30),
    degree character varying(60) NOT NULL,
    branch_id character(8) NOT NULL
);


ALTER TABLE public.member OWNER TO postgres;

--
-- Name: member_member_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.member_member_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.member_member_id_seq OWNER TO postgres;

--
-- Name: member_member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.member_member_id_seq OWNED BY public.member.member_id;


--
-- Name: organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization (
    org_id integer NOT NULL,
    name character varying(180) NOT NULL,
    address character varying(100) NOT NULL,
    postal_code integer NOT NULL,
    city character varying(40) NOT NULL,
    CONSTRAINT organization_postal_code_check CHECK (((postal_code < 1000000) AND (postal_code > 0)))
);


ALTER TABLE public.organization OWNER TO postgres;

--
-- Name: organization_org_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organization_org_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organization_org_id_seq OWNER TO postgres;

--
-- Name: organization_org_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organization_org_id_seq OWNED BY public.organization.org_id;


--
-- Name: science; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.science (
    science_id character(8) NOT NULL,
    name character varying(30) NOT NULL
);


ALTER TABLE public.science OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(32) NOT NULL,
    password character(60) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public.users.id;


--
-- Name: applicant applicant_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applicant ALTER COLUMN applicant_id SET DEFAULT nextval('public.applicant_applicant_id_seq'::regclass);


--
-- Name: b_passport b_passport_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b_passport ALTER COLUMN b_passport_id SET DEFAULT nextval('public.b_passport_b_passport_id_seq'::regclass);


--
-- Name: dissertation dissertation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dissertation ALTER COLUMN dissertation_id SET DEFAULT nextval('public.dissertation_dissertation_id_seq'::regclass);


--
-- Name: member member_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member ALTER COLUMN member_id SET DEFAULT nextval('public.member_member_id_seq'::regclass);


--
-- Name: organization org_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization ALTER COLUMN org_id SET DEFAULT nextval('public.organization_org_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: applicant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applicant (applicant_id, council_id, surname, name, abstract, degree) FROM stdin;
\.


--
-- Data for Name: b_passport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b_passport (b_passport_id, branch_id, definition, research, differentiation) FROM stdin;
1	01.01.02	Дифференциальные уравнения, динамические системы и оптимальное управление – область математической науки, предметом исследований которой являются разрешимость и свойства решений обыкновенных дифференциальных уравнений, уравнений в частных производных, функционально-дифференциальных уравнений, уравнений в конечных разностях, дифференциально-операторных уравнений, дифференциальных неравенств и включений, а также свойства дискретных, непрерывных, случайных, стохастических динамических систем и задачи оптимального управления для дифференциальных уравнений и их систем.	Развитие теории обыкновенных дифференциальных уравнений и уравнений в частных производных, интегральных, интегро-дифференциальных, функционально-дифференциальных, дифференциально-операторных уравнений, дифференциальных уравнений со случайными параметрами, динамических систем, оптимизации динамических систем.\r\nРазработка методов с использованием дифференциальных уравнений для решения прикладных задач.	В отличие от специальности 01.01.02, к специальности 01.01.01 – вещественный, комплексный и функциональный анализ относятся только те работы, основные результаты которых характеризуют свойства специальных классов функциональных пространств и специальных классов операторов, возникающих при исследовании дифференциальных уравнений.\r\n\r\n \r\n\r\nК специальности 01.01.02, в отличие от специальности 01.01.03 – математическая физика, относятся те работы, основные результаты которых касаются свойств уравнений, входящих в состав математических моделей физических явлений, но не затрагивают физической сущности процессов, описываемых этими моделями.\r\n\r\n \r\n\r\nК специальности 01.01.02, в отличие от специальности 01.01.07 – вычислительная математика, относятся те работы, в которых приближенные методы используются для решения задач, возникающих в теории дифференциальных уравнений, но не являются самостоятельным объектом исследования.
2	01.01.05	Теория вероятностей и математическая статистика - область математической науки, предметом которой является построение и анализ математических моделей случайных явлений.	Вероятностные пространства и случайные элементы.\r\nПредельные теоремы.\r\nСлучайные процессы и поля.\r\nСтохастический анализ и стохастические дифференциальные уравнения.\r\nСлучайные процессы специального вида, включая процессы массового обслуживания.\r\nСтатистические выводы и анализ данных.\r\nПоследовательный анализ.\r\nНепараметрическая и робастная статистика.\r\nСтатистика случайных процессов, полей и временных рядов.\r\nВероятностно-статистическое моделирование.	В отличие от специальности 01.01.05, к специальности 01.01.01 – математический анализ относятся только те работы, основные результаты которых характеризуют свойства специальных классов функциональных пространств и специальных классов операторов, возникающих при исследовании проблем теории вероятностей и математической статистики.\r\n\r\nВ отличие от специальности 01.01.05, в рамках специальности 01.01.07 - вычислительная математика проводятся исследования приближенных методов, разрабатывается теория построения вычислительных алгоритмов для решения задач, возникающих в этой специальности.\r\n\r\nВ рамках специальности 01.01.05 изучаются математические модели случайных явлений и объектов, в отличие от специальности 01.01.09 - дискретная математика и математическая кибернетика, где рассматриваются дискретные математические модели и методы исследования и решения задач.\r\n\r\nВ отличие от специальности 05.13.18 - математическое моделирование, численные методы и комплексы программ, в рамках специальности 01.01.05 проводятся исследования универсальных математических закономерностей, лежащих в основе моделей случайных явлений.
3	01.01.06	Математическая логика, алгебра и теория чисел - область математической науки, предметом которой является исследование свойств целых чисел; изучение множеств с заданными на них алгебраическими операциями и отношениями; исследования свойств множеств решений систем алгебраических уравнений; изучение общего строения математических теорий, их моделей и алгоритмических процессов.	Логические и логико-математические языки, логические системы и логико-математические теории, теории моделей, алгоритмическая разрешимость логических и логико-математических теорий, теории множеств.\r\nТеории алгебраических структур; линейная и полилинейная алгебра, теория представлений, гомологическая алгебра и алгебраическая K-теория; алгебраическая геометрия, топологическая алгебра; теории категорий и универсальной алгебры.\r\nАналитическая, алгебраическая, геометрическая и алгоритмическая теории чисел; диофантовы уравнения и приближения.	В случае преобладания в работах аналитических методов на объектах без специальной теоретико-числовой структуры такие работы относятся к специальности 01.01.01 – математический анализ.\r\n\r\nВ случае преобладания геометрических и топологических результатов и методов в работах по алгебраической геометрии, а также в случае преобладания топологических результатов и методов в работах по гомологической алгебре и алгебраической K-теории такие работы относятся к специальности 01.01.04 – геометрия и топология.
25	01.01.01	Тестовое опреледеление	Тестовая область исследования	Тестовая расходимость
\.


--
-- Data for Name: b_passport_branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b_passport_branch (b_passport_id, branch_id) FROM stdin;
1	01.01.02
1	01.01.05
2	01.01.02
2	01.01.06
25	01.01.02
\.


--
-- Data for Name: branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branch (branch_id, name, bg_id) FROM stdin;
01.01.02	Дифференциальные уравнения, динамические системы и оптимальное управление	01.01.00
01.01.05	Теория вероятностей и математическая статистика	01.01.00
01.01.06	Математическая логика, алгебра и теория чисел	01.01.00
01.01.07	Вычислительная математика	01.01.00
01.01.09	Дискретная математика и математическая кибернетика	01.01.00
01.02.04	Механика деформируемого твердого тела	01.02.00
01.02.06	Динамика, прочность машин, приборов и аппаратуры	01.02.00
01.02.05	Механика жидкости, газа и плазмы	01.02.00
01.02.08	Биомеханика	01.02.00
01.01.03	Математическая физика	01.01.00
01.01.04	Геометрия и топология	01.01.00
03.01.02	Биофизика	03.01.00
03.01.03	Молекулярная биология	03.01.00
03.01.04	Биохимия	03.01.00
03.01.05	Физиология и биохимия растений	03.01.00
03.02.04	Зоология	03.02.00
03.02.05	Энтомология	03.02.00
03.02.06	Ихтиология	03.02.00
03.02.09	Биогеохимия	03.02.00
99.99.98	Кекекt	01.01.00
99.99.99	kekeke	01.01.00
01.01.01	Тестовая специальность	01.01.00
\.


--
-- Data for Name: branch_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branch_group (bg_id, name, science_id) FROM stdin;
01.01.00	Математические науки	01.00.00
01.02.00	Механика	01.00.00
03.01.00	Физико-химическая биология	03.00.00
03.02.00	Общая биология	03.00.00
01.03.00	Тестовая группа	01.00.00
\.


--
-- Data for Name: branch_science; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branch_science (branch_id, science_id) FROM stdin;
\.


--
-- Data for Name: council; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.council (council_id, creation_date, expiration_date, org_id, phone) FROM stdin;
Д 01.05.02	2020-01-11	2024-08-17	2	912 29 18
Д 02.01.17	2019-12-10	2022-06-11	1	192 22 91
Д 02.01.16	2019-05-12	2023-07-22	1	109 99 89
Д 02.01.10	2019-06-01	2022-05-10	2	133 33 33
Д 01.13.01	2020-11-22	2024-10-18	4	109 19 19
Д 02.12.01	2019-10-22	2025-10-18	4	781 81 12
Д 02.15.05	2019-05-18	2021-11-14	5	181 10 10
Д 02.15.07	2019-11-09	2023-02-12	5	292 22 12
Д 02.05.17	2020-11-09	2024-02-12	5	192 81 81
Д 12.01.03	2021-03-08	2021-03-23	5	121 11 11
Д 01.06.01	2018-03-10	2022-10-16	4	192 22 34
Д 01.07.01	2021-01-11	2024-10-17	2	881 12 12
Д 02.01.15	2019-06-08	2022-07-11	2	182 11 19
Д 01.01.01	2021-02-28	2021-03-14	5	111 11 11
Д 01.02.01	2019-01-09	2024-06-13	2	142 22 14
Д 01.02.05	2021-03-03	2021-03-17	2	101 19 19
\.


--
-- Data for Name: council_branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.council_branch (council_id, branch_id) FROM stdin;
Д 01.05.02	01.02.08
Д 01.06.01	01.01.07
Д 01.07.01	01.01.03
Д 01.07.01	01.02.04
Д 01.13.01	01.02.08
Д 02.01.10	01.01.09
Д 02.01.10	01.02.05
Д 02.01.16	01.01.04
Д 02.01.16	01.01.09
Д 02.01.16	01.02.04
Д 02.01.17	01.02.06
Д 02.12.01	01.01.02
Д 02.12.01	01.01.03
Д 02.15.05	01.01.07
Д 02.15.07	01.02.04
Д 12.01.03	01.01.02
Д 01.02.05	01.01.04
Д 01.01.01	01.01.09
Д 01.01.01	01.01.05
Д 01.01.01	01.02.06
Д 01.02.01	01.01.02
Д 02.01.15	01.01.04
\.


--
-- Data for Name: dissertation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dissertation (dissertation_id, applicant_id, theme, deadline_date, science_id, classroom) FROM stdin;
\.


--
-- Data for Name: dissertation_branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dissertation_branch (dissertation_id, branch_id) FROM stdin;
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.member (council_id, member_id, surname, name, post, degree, branch_id) FROM stdin;
Д 01.02.01	2	Скрежендевский	Олен	Заместитель	Доктор наук	01.01.02
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organization (org_id, name, address, postal_code, city) FROM stdin;
2	Институт математики НАН Беларуси	ул. Сурганова, 11	220072	Минск
3	Гомельский государственный университет имени Франциска Скорины	ул. Советская, 104	246019	Гомель
4	Белорусский государственный университет транспорта	ул. Кирова, 34	246653	Гомель
5	Институт защиты растений	ул. Мира, 2	223011	а/г. Прилуки Минского района
1	Институт леса НАН Беларуси	ул. Пролетарская, 71	246001	Гомель
\.


--
-- Data for Name: science; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.science (science_id, name) FROM stdin;
01.00.00	Физико-математические науки
03.00.00	Биологические науки
02.00.00	Тестовые науки
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password) FROM stdin;
1	123	123
10	polesmith	$2b$10$lMpSwPkQmjYTbLxZoNIDNuAjO1wae4wcnaQMfhfenXFM6CNNIrbnS   -- password: 123
\.


--
-- Name: applicant_applicant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applicant_applicant_id_seq', 1, false);


--
-- Name: b_passport_b_passport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.b_passport_b_passport_id_seq', 25, true);


--
-- Name: dissertation_dissertation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dissertation_dissertation_id_seq', 1, false);


--
-- Name: member_member_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.member_member_id_seq', 2, true);


--
-- Name: organization_org_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organization_org_id_seq', 5, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 12, true);


--
-- Name: applicant applicant_abstract_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applicant
    ADD CONSTRAINT applicant_abstract_key UNIQUE (abstract);


--
-- Name: applicant applicant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applicant
    ADD CONSTRAINT applicant_pkey PRIMARY KEY (applicant_id);


--
-- Name: b_passport_branch b_passport_branch_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b_passport_branch
    ADD CONSTRAINT b_passport_branch_pk PRIMARY KEY (b_passport_id, branch_id);


--
-- Name: b_passport b_passport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b_passport
    ADD CONSTRAINT b_passport_pkey PRIMARY KEY (b_passport_id);


--
-- Name: branch_group branch_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_group
    ADD CONSTRAINT branch_group_name_key UNIQUE (name);


--
-- Name: branch_group branch_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_group
    ADD CONSTRAINT branch_group_pkey PRIMARY KEY (bg_id);


--
-- Name: branch branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch
    ADD CONSTRAINT branch_pkey PRIMARY KEY (branch_id);


--
-- Name: council_branch council_branch_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.council_branch
    ADD CONSTRAINT council_branch_pk PRIMARY KEY (council_id, branch_id);


--
-- Name: council council_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.council
    ADD CONSTRAINT council_pkey PRIMARY KEY (council_id);


--
-- Name: dissertation dissertation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dissertation
    ADD CONSTRAINT dissertation_pkey PRIMARY KEY (dissertation_id);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (member_id);


--
-- Name: organization organization_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_name_key UNIQUE (name);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (org_id);


--
-- Name: science science_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.science
    ADD CONSTRAINT science_name_key UNIQUE (name);


--
-- Name: science science_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.science
    ADD CONSTRAINT science_pkey PRIMARY KEY (science_id);


--
-- Name: users user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- Name: applicant_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX applicant_idx ON public.applicant USING btree (applicant_id);


--
-- Name: user_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_id_uindex ON public.users USING btree (id);


--
-- Name: user_username_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_username_uindex ON public.users USING btree (username);


--
-- Name: applicant applicant_council_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applicant
    ADD CONSTRAINT applicant_council_id_fkey FOREIGN KEY (council_id) REFERENCES public.council(council_id);


--
-- Name: b_passport_branch b_passport_branch_b_passport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b_passport_branch
    ADD CONSTRAINT b_passport_branch_b_passport_id_fkey FOREIGN KEY (b_passport_id) REFERENCES public.b_passport(b_passport_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b_passport_branch b_passport_branch_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b_passport_branch
    ADD CONSTRAINT b_passport_branch_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b_passport b_passport_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b_passport
    ADD CONSTRAINT b_passport_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id);


--
-- Name: branch branch_bg_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch
    ADD CONSTRAINT branch_bg_id_fkey FOREIGN KEY (bg_id) REFERENCES public.branch_group(bg_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: branch_group branch_group_science_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_group
    ADD CONSTRAINT branch_group_science_id_fkey FOREIGN KEY (science_id) REFERENCES public.science(science_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: branch_science branch_science_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_science
    ADD CONSTRAINT branch_science_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: branch_science branch_science_science_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_science
    ADD CONSTRAINT branch_science_science_id_fkey FOREIGN KEY (science_id) REFERENCES public.science(science_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: council_branch council_branch_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.council_branch
    ADD CONSTRAINT council_branch_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: council_branch council_branch_council_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.council_branch
    ADD CONSTRAINT council_branch_council_id_fkey FOREIGN KEY (council_id) REFERENCES public.council(council_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: council council_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.council
    ADD CONSTRAINT council_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organization(org_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dissertation dissertation_applicant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dissertation
    ADD CONSTRAINT dissertation_applicant_id_fkey FOREIGN KEY (applicant_id) REFERENCES public.applicant(applicant_id);


--
-- Name: dissertation_branch dissertation_branch_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dissertation_branch
    ADD CONSTRAINT dissertation_branch_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id);


--
-- Name: dissertation_branch dissertation_branch_dissertation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dissertation_branch
    ADD CONSTRAINT dissertation_branch_dissertation_id_fkey FOREIGN KEY (dissertation_id) REFERENCES public.dissertation(dissertation_id);


--
-- Name: dissertation dissertation_science_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dissertation
    ADD CONSTRAINT dissertation_science_id_fkey FOREIGN KEY (science_id) REFERENCES public.science(science_id);


--
-- Name: member member_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: member member_council_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_council_id_fkey FOREIGN KEY (council_id) REFERENCES public.council(council_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

