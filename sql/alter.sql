use youout;

-- 05/10/23 --
alter table tbl_places add denunciado bool default false;
alter table tbl_avaliacoes add denunciado bool default false;
alter table tbl_respotas add denunciado bool default false;
-- ----------------------------------------------------