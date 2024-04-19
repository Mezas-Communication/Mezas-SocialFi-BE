create schema if not exists dev;
set schema 'dev';
create table if not exists image
(
    id  serial
        constraint image_pk
            primary key,
    url varchar not null
);

alter table image
    owner to postgres;

create unique index if not exists image_id_uindex
    on image (id);

create table if not exists "user"
(
    id            serial
        constraint user_pk
            primary key,
    name          varchar,
    update_at     timestamp,
    delete_at     timestamp,
    create_at     timestamp default now(),
    mnemonic      varchar,
    role          integer   default 0,
    password      varchar,
    username      varchar,
    address       varchar(42),
    last_login_at timestamp,
    avatar        varchar
    posts         integer    default 0,
);

alter table "user"
    owner to postgres;

create unique index if not exists user_id_uindex
    on "user" (id);

create unique index if not exists user_mnemonic_uindex
    on "user" (mnemonic);

create unique index if not exists user_address_uindex
    on "user" (address);

create unique index if not exists user_username_uindex
    on "user" (username);

create table if not exists synchronize
(
    id                serial
        constraint synchronize_pk
            primary key,
    last_block_number integer not null,
    update_at         timestamp,
    delete_at         timestamp,
    create_at         timestamp default now()
);

alter table synchronize
    owner to postgres;

create unique index if not exists synchronize_id_uindex
    on synchronize (id);

create table if not exists transaction
(
    id               serial
        constraint transaction_pk
            primary key,
    transaction_hash varchar(66) not null,
    synchronize_id   integer     not null
        constraint transaction_synchronize_id_fk
            references synchronize,
    value            varchar,
    update_at        timestamp,
    delete_at        timestamp,
    create_at        timestamp default now(),
    block_number     integer     not null,
    block_hash       varchar(66) not null,
    user_id_from     integer     not null
        constraint transaction___fku
            references "user",
    user_id_to       integer     not null
        constraint transaction_user_id_fk
            references "user"
);

alter table transaction
    owner to postgres;

create unique index if not exists transaction_id_uindex
    on transaction (id);

create unique index if not exists transaction_transaction_hash_uindex
    on transaction (transaction_hash);

create table if not exists nft
(
    id        serial
        constraint table_name_pk
            primary key,
    token_id  integer not null,
    metadata  jsonb,
    create_at timestamp default now(),
    update_at timestamp,
    delete_at timestamp,
    status    integer,
    user_id   integer not null
        constraint nft_user_id_fk
            references "user",
    slug      varchar
);

alter table nft
    owner to postgres;

create unique index if not exists table_name_id_uindex
    on nft (id);

create unique index if not exists table_name_token_id_uindex
    on nft (token_id);

create table if not exists nft_transaction
(
    nft_id         integer not null
        constraint nft_transaction_nft_id_fk
            references nft,
    transaction_id integer not null
        constraint nft_transaction_transaction_id_fk
            references transaction,
    event          varchar,
    id             serial
        constraint nft_transaction_pk
            primary key,
    metadata       jsonb,
    user_id        integer
        constraint nft_transaction_user_id_fk
            references "user"
);

alter table nft_transaction
    owner to postgres;

create unique index if not exists nft_transaction_id_uindex
    on nft_transaction (id);

create table if not exists token
(
    id        serial
        constraint access_token_pk
            primary key,
    token     varchar,
    create_at timestamp default now(),
    user_id   integer not null
        constraint access_token_user_id_fk
            references "user"
);

alter table token
    owner to postgres;

create unique index if not exists access_token_id_uindex
    on token (id);

create table if not exists posts 
(
    id        serial
        constraint posts_pk 
            primary key,
    user_id integer not null
        constraint posts_user_id_fk
        references "user",
    title text not null,
    content text,
    image_url varchar
    views         integer    default 0,
    likes         integer    default 0,
    create_at timestamp default now(),
    update_at timestamp,
);

alter table posts
    owner to postgres;

create unique index if not exists posts_id_uindex
    on posts (id);