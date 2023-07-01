create database youout;
use youout;

create table tbl_usuario(
	id integer auto_increment not null,
    nome varchar(65) not null,
    email varchar(65) not null,
    hashPass varchar(150) default null,
    telefone int(15) default null,
    
    criado datetime default now(),
    deletado_dia date default null,
    deletado boolean not null default false,
    
    primary key(id)
);

drop table tbl_usuario;
desc tbl_usuario;
select * from tbl_usuario;