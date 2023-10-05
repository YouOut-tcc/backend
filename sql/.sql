create database if not exists youout;
use youout;
-- drop database youout;

-- eu carlos, não sei escrever respostas

create table if not exists tbl_usuario(
	id           integer auto_increment not null,
    nome         varchar(65) not null,
    email        varchar(65) unique not null,
    hashPass     varchar(150) default null,
    telefone     int(15) default null,
    
    criado       datetime default now(),
    deletado_dia date default null,
    deletado     boolean not null default false,
    
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
    criado           datetime default now(),
    deletado_dia     date     default null,
    deletado         boolean  not null default false,
    
    primary key(id)
);

create table if not exists tbl_tags(
    id  integer auto_increment not null,
    tag varchar(255) not null,
    primary key(id)
);

create table if not exists tbl_place_has_tags(
    id          integer auto_increment not null,
    tag         varchar(255) not null,
    FK_place_id integer not null,
    primary key(id),
    foreign key(FK_place_id) references tbl_places(id)
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

-- so um teste, não tenho a menor ideia se isso ajuda
CREATE INDEX parent_index ON tbl_place_logins (parent);

-- colocar um sistema de permissoes
create table if not exists tbl_logins_has_places(
    id          integer auto_increment not null,
    FK_place_id integer not null,
    FK_login_id integer not null,
    criado      datetime default now(),
    permissions bit(16) not null default b'0000000000000000',
    
    primary key(id),
    foreign key(FK_place_id) references tbl_places(id),
    foreign key(FK_login_id) references tbl_place_logins(id),
    unique(FK_place_id, FK_login_id)
);

-- adicionar columa de denunciado
create table if not exists tbl_avaliacoes(
    id            integer auto_increment not null,
    FK_usuario_id integer not null,
    FK_place_id   integer not null,

    pontuacao  decimal(3, 1) unsigned  NOT NULL,
    -- comentario_null 
    comentario varchar(255) default '',
    
    denunciado bool     default false,
    criado     datetime default now(),

    primary key(id),
    foreign key(FK_place_id) references tbl_places(id),
    foreign key(FK_usuario_id) references tbl_usuario(id)
);

-- fazendo essa tabela dessa forma, deixa possivel uma avaliação receber varios comentarios
-- algo indesejado, tratar isso na logica do backend, mas mander por motivos de compatibilidade
create table if not exists tbl_respotas(
    id              integer auto_increment not null,
    FK_avaliacao_id integer not null,
	fk_place_logins_id  integer not null,
    -- comentario_null 
    
    denunciado bool         default false,
    comentario varchar(255) default '',
    criado     datetime default now(),

    primary key(id),
    foreign key(FK_avaliacao_id) references tbl_avaliacoes(id),
    foreign key(fk_place_logins_id) references tbl_place_logins(id)
);

create table if not exists tbl_favoritos(
    id            integer auto_increment not null,
    FK_usuario_id integer not null,
    FK_place_id   integer not null,
    criado        datetime default now(),
    primary key(id),
    foreign key(FK_usuario_id) references tbl_usuario(id),
    foreign key(FK_place_id) references tbl_places(id),
    UNIQUE (FK_usuario_id, FK_place_id)
);

create table if not exists tbl_promocao(
    id int auto_increment not null,
    fk_est int not null,
    dt_criacao datetime default now(),
    dt_vencimento date default null,
    deletado boolean default false,
    descricao varchar(150) not null,
    primary key(id),
    foreign key(fk_est) references tbl_places(id)
);
-- colocar nome para eventos
create table if not exists tbl_eventos(
	id int auto_increment not null,
    deletado boolean default null,
    dt_criacao datetime default now(),
    nome varchar(150) not null,
    descricao varchar(150),
    dt_inicio date default null,
    dt_fim date default null,
    fk_est int not  null,
    primary key(id),
    foreign key(fk_est) references tbl_places(id)
);

create table if not exists tbl_cupons (
	id int auto_increment not null,
    fk_est int not null,
    dt_criacao datetime default now(),
    dt_vencimento date default null,
    deletado boolean default false,
    descricao varchar(30) not null,
    primary key(id),
    foreign key(fk_est) references tbl_places(id)
);

create table if not exists tbl_places_denuncias (
	id          integer auto_increment,
    fk_place_id integer,
    motivo      varchar(255),
    
    criado      datetime default now(),
    
    primary key(id),
    foreign key(fk_place_id) references tbl_places(id)
);

create table if not exists tbl_avaliacoes_denuncias (
	id               integer auto_increment,
    fk_avaliacoes_id integer,
    motivo           varchar(255),
    
    criado           datetime default now(),
    
    primary key(id),
    foreign key(fk_avaliacoes_id) references tbl_avaliacoes(id)
);

create table if not exists tbl_respotas_denuncias (
	id               integer auto_increment,
    fk_respotas_id   integer,
    motivo           varchar(255),
    
    criado           datetime default now(),
    
    primary key(id),
    foreign key(fk_respotas_id) references tbl_respotas(id)
);

create or replace view vw_notas as
select FK_place_id id, round(avg(pontuacao), 1) nota 
    from tbl_avaliacoes 
    group by FK_place_id;
    

