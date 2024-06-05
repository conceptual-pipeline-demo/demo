create table if not exists client_info
(
    id         varchar(40)  not null,
    name       varchar(40),
    gender     varchar(10),
    email      varchar(40),
    phone      varchar(13),
    address    varchar(100),
    created_at timestamp(6) not null default CURRENT_TIMESTAMP,
    updated_at timestamp(6) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    primary key (id)
);