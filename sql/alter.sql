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