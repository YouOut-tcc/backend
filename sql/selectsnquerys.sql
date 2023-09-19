use youout;
-- alter table tbl_places rename column note to  nota;
-- desc tbl_usuario;
select * from tbl_avaliacoes; 
select * from tbl_favoritos;
select * from tbl_place_logins;

select id, nome, telefone, celular, numero, cep, longitude, latitute, criado 
	from tbl_places 
		where uuid=uuid_to_bin('00036686-9ac5-51e1-b8cc-cc301829b797') 
        and deletado = 0;
        
select * from tbl_places;
select cnpj, uuid_from_bin(uuid) from tbl_places;
select * from tbl_logins_has_places;
select * from tbl_avaliacoes where FK_place_id=1 and FK_usuario_id=1;
-- select uuid_from_bin(uuid_v5(uuid(), ''));

select a.email, b.permissions, b.FK_place_id from tbl_place_logins a 
	join tbl_logins_has_places b on a.id = b.FK_login_id where email='gerente.cartola@gmail.com' and deletado = 0;
    
select a.email, a.parent, bin(b.permissions) permissions from tbl_place_logins a join tbl_logins_has_places b on a.id = b.FK_login_id where email='carlos@gmail.com' and deletado = 0;

select bin(b.permissions) permissions from tbl_place_logins a join tbl_logins_has_places b on a.id = b.FK_login_id where a.id=3 and b.FK_place_id=2 and deletado = 0;
-- -------------------------------------------------
-- selects para localização;

-- Longitude = ST_Y() 
-- Latitude = ST_X()
--               latitude   , longitude
-- insert (point(-73.9898293, 40.7628267));
-- select ST_Distance_Sphere(
--    coordenadas,
--    point(-73.9898293, 40.7628267)
-- ) distancia FROM localizacao order by distancia limit 3 offset 0;

-- SELECT ST_AsText(coordenadas) coordenadas FROM localizacao;

-- -------------------------------------------------
select uuid_from_bin(uuid) from tbl_places;
select a.pontuacao, a.comentario, a.criado, b.nome from tbl_avaliacoes a
join tbl_usuario b on b.id = a.FK_usuario_id 
	where FK_place_id=1;

select * from tbl_places where uuid=uuid_to_bin('8f243d99-022b-521b-a2e5-b4d061a299bb');

select * from tbl_avaliacoes;
select uuid_from_bin(uuid) from tbl_places;
select * from tbl_usuario;
select * from tbl_favoritos where FK_usuario_id = 1 and FK_place_id = 1;
select * from tbl_favoritos;
use zero;
select ST_AsGeoJSON(coordenadas) from localizacao;

delete from tbl_favoritos where FK_usuario_id = 1 and FK_place_id = 1;

delete from tbl_favoritos;


