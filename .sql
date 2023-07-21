create database youout;
use youout;
-- drop database youout;

create table tbl_usuario(
	id       integer auto_increment not null,
    nome     varchar(65) not null,
    email    varchar(65) not null,
    hashPass varchar(150) default null,
    telefone int(15) default null,
    
    criado       datetime default now(),
    deletado_dia date default null,
    deletado     boolean not null default false,
    
    primary key(id)
);

-- falta imformação, nome que vai mostrar e um uuid ou coisa do tipo
-- tags para pesquisa
-- acho que o tipo UUID não exite no mysql
create table tbl_places(
	id            integer auto_increment not null,
    uuid          binary(16) not null unique,

    cnpj          int(18) unique not null,
    nome_fantasia varchar(65) not null,
    nome          varchar(255) not null,
    telefone      int(15) default null,
    celular       int(15) default null,

    -- Endereço:
    -- mudar numero para suporta letras
    numero int(15) default null,
    bairro varchar(65) not null,
    cidade varchar(65) not null,
    cep    int(15) not null,
    uf     varchar(2) not null,
    rua    varchar(65) not null,

    -- localização:
    longitude int(22) not null,
    latitute  int(22) not null,

    criado       datetime default now(),
    deletado_dia date default null,
    deletado     boolean not null default false,
    
    primary key(id)
);

create table tbl_place_logins(
	id       integer auto_increment not null,
    nome     varchar(65) not null,
    email    varchar(65) not null,
    hashPass varchar(150) default null,
    telefone int(15) default null,

    tipo_acesso varchar(45) not null, -- remover
    
    criado       datetime default now(),
    deletado_dia date default null,
    deletado     boolean not null default false,
    
    primary key(id)
);

-- colocar um sistema de permissoes
create table tbl_logins_has_places(
    id          integer auto_increment not null,
    FK_place_id integer not null,
    FK_login_id integer not null,
    criado      datetime default now(),
    
    primary key(id),
    foreign key(FK_place_id) references tbl_places(id),
    foreign key(FK_login_id) references tbl_place_logins(id)
);

-- drop table tbl_usuario;
-- drop database youout;
desc tbl_usuario;
select * from tbl_usuario;
select * from tbl_place_logins;
select * from tbl_places;
select * from tbl_logins_has_places;
-- select uuid_from_bin(uuid_v5(uuid(), ''));