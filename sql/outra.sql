create database if not exists youout;
use youout;

-- create database if not exists yououttest;
-- drop database yououttest;
-- use yououttest;

create table if not exists tbl_usuarios(
	id           integer auto_increment not null,
    nome         varchar(65) not null,
    email        varchar(65) unique not null,
    hashPass     varchar(150) default null,
    telefone     int(15) default null,
    
    deletado_dia date default null,
    deletado     boolean not null default false,
    criado       datetime default now(),
    
    primary key(id)
);

-- Tirar a columas notas
create table if not exists tbl_places(
	id               integer auto_increment not null,
    uuid             binary(16) not null unique,

    cnpj             char(18) unique not null,
    nome_empresarial varchar(255) not null,
    nome             varchar(255) not null,
    telefone         char(20) default null,
    celular          char(20) default null,

    icon_url         varchar(255) default null,
    descricao        text default null,
    nota             decimal(3, 1) unsigned  not null,

    -- Endereço:
    numero           varchar(32) default null,
    cep              char(12) not null,

    -- localização:
    coordenadas      geometry not null,

	denunciado       bool     default false,
    denuncias        integer  default 0,
    deletado_dia     datetime     default null,
    deletado         boolean  not null default false,
    criado           datetime default now(),
    
    primary key(id),
    fulltext(nome, descricao)
);

create table if not exists tbl_tags(
    id  integer auto_increment not null,
    tag varchar(255) not null,

    primary key(id)
);

create table if not exists tbl_place_has_tags(
    id          integer auto_increment not null,
    fk_tag_id 	integer not null,
    fk_place_id integer not null,

    primary key(id),
    foreign key(fk_place_id) references tbl_places(id),
    foreign key(fk_tag_id) references tbl_tags(id)
);

create table if not exists tbl_place_logins(
	id       integer auto_increment not null,
    nome     varchar(65) not null,
    email    varchar(65) unique not null,
    hashPass varchar(150) default null,
    telefone int(15) default null,
    
    parent  integer not null,

    criado       datetime default now(),
    deletado_dia date default null,
    deletado     boolean not null default false,
    
    primary key(id)
);

create table if not exists tbl_login_has_places(
    id          integer auto_increment not null,
    fk_place_id integer not null,
    fk_login_id integer not null,
    permissoes  bit(16) not null default b'0000000000000000',

    criado      datetime default now(),
    
    primary key(id),
    foreign key(fk_place_id) references tbl_places(id),
    foreign key(fk_login_id) references tbl_place_logins(id),
    unique(fk_place_id, fk_login_id)
);

create table if not exists tbl_avaliacoes(
    id            integer auto_increment not null,
    fk_usuario_id integer not null,
    fk_place_id   integer not null,

    pontuacao  decimal(3, 1) unsigned  NOT NULL,
    -- comentario_null 
    comentario varchar(255) default '',
    
    denunciado   boolean  default false,
    denuncias    integer  default 0,
    deletado     boolean  not null default false,
    deletado_dia datetime default null,
    criado       datetime default now(),

    primary key(id),
    foreign key(fk_place_id) references tbl_places(id),
    foreign key(fk_usuario_id) references tbl_usuarios(id)
);

-- fazendo essa tabela dessa forma, deixa possivel uma avaliação receber varios comentarios
-- algo indesejado, tratar isso na logica do backend, mas mander por motivos de compatibilidade
create table if not exists tbl_respostas(
    id              integer auto_increment not null,
    fk_avaliacao_id integer not null,
	fk_place_login_id  integer not null,
    -- comentario_null 
    
    denunciado   boolean      default false,
    denuncias    integer      default 0,
    comentario   varchar(255) default '',
    deletado     boolean      not null default false,
    deletado_dia datetime     default null,
    criado       datetime     default now(),

    primary key(id),
    foreign key(fk_avaliacao_id) references tbl_avaliacoes(id),
    foreign key(fk_place_login_id) references tbl_place_logins(id)
);

create table if not exists tbl_favoritos(
    id            integer auto_increment not null,
    fk_usuario_id integer not null,
    fk_place_id   integer not null,

    criado        datetime default now(),

    primary key(id),
    foreign key(fk_usuario_id) references tbl_usuarios(id),
    foreign key(fk_place_id) references tbl_places(id),
    UNIQUE (fk_usuario_id, fk_place_id)
);

create table if not exists tbl_promocoes(
    id integer  auto_increment not null,
    fk_place_id integer not null,
    vencimento  date default null,
    descricao   varchar(150) not null,

    deletado   boolean default false,
    criado     datetime default now(),

    primary key(id),
    foreign key(fk_place_id) references tbl_places(id)
);

create table if not exists tbl_eventos(
	id          integer auto_increment not null,
    fk_place_id integer not  null,
    nome        varchar(150) not null,
    descricao   varchar(150),
    inicio      datetime default null,
    fim         datetime default null,

    deletado    boolean default false,
    criado      datetime default now(),

    primary key(id),
    foreign key(fk_place_id) references tbl_places(id)
);

create table if not exists tbl_cupons (
	id          integer auto_increment not null,
    fk_place_id integer not null,
    descricao   varchar(30) not null,
    vencimento  date default null,

    deletado boolean default false,
    criado   datetime default now(),

    primary key(id),
    foreign key(fk_place_id) references tbl_places(id)
);

create table if not exists tbl_place_denuncias (
	id            integer auto_increment,
    fk_place_id   integer,
    fk_usuario_id integer,
    motivo        varchar(255),
    
    criado        datetime default now(),
    
    primary key(id),
    foreign key(fk_place_id) references tbl_places(id),
    foreign key(fk_usuario_id) references tbl_usuarios(id)
);

create table if not exists tbl_avaliacao_denuncias (
	id               integer auto_increment,
    fk_avaliacao_id  integer,
    fk_usuario_id    integer,
    motivo           varchar(255),
    
    criado           datetime default now(),
    
    primary key(id),
    foreign key(fk_avaliacao_id) references tbl_avaliacoes(id),
    foreign key(fk_usuario_id) references tbl_usuarios(id)
);

create table if not exists tbl_resposta_denuncias (
	id               integer auto_increment,
    fk_resposta_id   integer,
    fk_usuario_id    integer,
    motivo           varchar(255),
    
    criado           datetime default now(),
    
    primary key(id),
    foreign key(fk_resposta_id) references tbl_respostas(id),
    foreign key(fk_usuario_id) references tbl_usuarios(id)
);

create or replace view vw_notas as
select fk_place_id id, round(avg(pontuacao), 1) nota 
    from tbl_avaliacoes 
    group by fk_place_id;