create database youout;
use youout;
-- drop database youout;

-- torma os email unicos para as duas tabelas

create table tbl_usuario(
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

-- TODO:
--       adicionar uma coluna de nota
--       adcionar coluna de descrição
--       adcionar uma coluna para banner
--       remover as colunas de endereço, so deixar cep
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
create table tbl_logins_has_places(
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
	fk_place_logins_id  integer not null,
    -- comentario_null 
    comentario varchar(255) default '',
    criado     datetime default now(),

    primary key(id),
    foreign key(FK_avaliacao_id) references tbl_avaliacoes(id),
    foreign key(fk_place_logins_id) references tbl_place_logins(id)
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

create table tbl_promocao(
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
create table tbl_eventos(
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

create table tbl_cupons (
	id int auto_increment not null,
    fk_est int not null,
    dt_criacao datetime default now(),
    dt_vencimento date default null,
    deletado boolean default false,
    descricao varchar(30) not null,
    primary key(id),
    foreign key(fk_est) references tbl_places(id)
);

-- drop table tbl_usuario;
-- drop database youout;
-- desc tbl_usuario;
select * from tbl_avaliacoes; 
select * from tbl_favoritos;
select * from tbl_place_logins;
select uuid_from_bin(uuid) from tbl_places;
select cnpj, uuid_from_bin(uuid) from tbl_places;
select * from tbl_logins_has_places;
select * from tbl_avaliacoes where FK_place_id=1 and FK_usuario_id=1;
-- select uuid_from_bin(uuid_v5(uuid(), ''));

select a.email, b.permissions, b.FK_place_id from tbl_place_logins a 
	join tbl_logins_has_places b on a.id = b.FK_login_id where email='gerente.cartola@gmail.com' and deletado = 0;
    
select a.email, a.parent, bin(b.permissions) permissions from tbl_place_logins a join tbl_logins_has_places b on a.id = b.FK_login_id where email='carlos@gmail.com' and deletado = 0;

select bin(b.permissions) permissions from tbl_place_logins a join tbl_logins_has_places b on a.id = b.FK_login_id where a.id=3 and b.FK_place_id=2 and deletado = 0;
