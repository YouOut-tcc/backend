use youout;

-- 05/10/23 --
alter table tbl_places add denunciado bool default false;
alter table tbl_avaliacoes add denunciado bool default false;
alter table tbl_respotas add denunciado bool default false;
-- ----------------------------------------------------


alter table tbl_eventos modify column deletado boolean default false;

-- -----------------------------------------------------------
-- 11/10/23 --
alter table tbl_places add fulltext(nome);
-- ---------------------------------------------------------
-- 14/10/23 --
alter table tbl_respotas rename tbl_respostas;
alter table tbl_place_has_tags add FK_tag_id integer not null;
alter table tbl_place_has_tags drop tag;
alter table tbl_place_has_tags add foreign key(FK_tag_id) references tbl_tags(id);

-- --------------------------------------------------------------
-- 15/10/23 --
alter table tbl_places add denuncias integer  default 0;
alter table tbl_avaliacoes add denuncias integer  default 0;
alter table tbl_respostas add denuncias integer  default 0;

alter table tbl_avaliacoes add deletado boolean  not null default false;
alter table tbl_respostas add deletado boolean  not null default false;

alter table tbl_avaliacoes add deletado_dia datetime default null;
alter table tbl_respostas add deletado_dia datetime default null;

alter table tbl_places modify column deletado_dia datetime default null;

alter table tbl_places_denuncias add fk_usuario_id integer;
alter table tbl_avaliacoes_denuncias add fk_usuario_id integer;
alter table tbl_respotas_denuncias add fk_usuario_id integer;

alter table tbl_places_denuncias add foreign key(fk_usuario_id) references tbl_usuario(id);
alter table tbl_avaliacoes_denuncias add foreign key(fk_usuario_id) references tbl_usuario(id);
alter table tbl_respotas_denuncias add foreign key(fk_usuario_id) references tbl_usuario(id);

-- ---------------------------------------------------------------


