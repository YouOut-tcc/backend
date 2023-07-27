create database youout;
use youout;
-- drop database youout;

create table tbl_usuario(
	id           integer auto_increment not null,
    nome         varchar(65) not null,
    email        varchar(65) not null,
    hashPass     varchar(150) default null,
    telefone     int(15) default null,
    
    criado       datetime default now(),
    deletado_dia date default null,
    deletado     boolean not null default false,
    
    primary key(id)
);

-- TODO: tags para pesquisa
--       adicionar uma coluna de nota
create table tbl_places(
	id            integer auto_increment not null,
    uuid          binary(16) not null unique,

    cnpj          int(18) unique not null,
    nome_fantasia varchar(65) not null,
    nome          varchar(255) not null,
    telefone      int(15) default null,
    celular       int(15) default null,

    -- Endereço:
    numero varchar(32) default null,
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

create table tbl_tags(
    id  integer auto_increment not null,
    tag varchar(255) not null,
    primary key(id)
);

create table tbl_place_has_tags(
    id          integer auto_increment not null,
    tag         varchar(255) not null,
    FK_place_id integer not null,
    primary key(id),
    foreign key(FK_place_id) references tbl_places(id)
);

create table tbl_place_logins(
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

create table tbl_avaliacoes(
    id            integer auto_increment not null,
    FK_usuario_id integer not null,
    FK_place_id   integer not null,

    pontuacao  decimal(3, 1) unsigned  NOT NULL,
    -- comentario_null 
    comentario varchar(255) default '',
    criado     datetime default now(),

    primary key(id),
    foreign key(FK_place_id) references tbl_places(id),
    foreign key(FK_usuario_id) references tbl_usuario(id)
);

-- fazendo essa tabela dessa forma, deixa possivel uma avaliação receber varios comentarios
-- algo indesejado, tratar isso na logica do backend, mas mander por motivos de compatibilidade
create table tbl_respotas(
    id              integer auto_increment not null,
    FK_avaliacao_id integer not null,

    -- comentario_null 
    comentario varchar(255) default '',
    criado     datetime default now(),

    primary key(id),
    foreign key(FK_avaliacao_id) references tbl_avaliacoes(id)
);

create table tbl_favoritos(
    id            integer auto_increment not null,
    FK_usuario_id integer not null,
    FK_place_id   integer not null,
    criado        datetime default now(),
    primary key(id),
    foreign key(FK_usuario_id) references tbl_usuario(id),
    foreign key(FK_place_id) references tbl_places(id),
    UNIQUE (FK_usuario_id, FK_place_id)
);

-- drop table tbl_usuario;
-- drop database youout;
-- desc tbl_usuario;
select * from tbl_avaliacoes; 
select * from tbl_favoritos;
-- select * from tbl_place_logins;
select * from tbl_places;
select cnpj, uuid_from_bin(uuid) from tbl_places;
select * from tbl_logins_has_places;
select * from tbl_avaliacoes where FK_place_id=1 and FK_usuario_id=1;
-- select uuid_from_bin(uuid_v5(uuid(), ''));