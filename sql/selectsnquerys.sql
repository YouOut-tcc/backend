use youout;

-- modelo antigo

-- alter table tbl_places rename column note to  nota;
-- desc tbl_usuario;
select * from tbl_avaliacoes; 
select * from tbl_tags;
select * from tbl_favoritos;
select * from tbl_place_logins;
select * from tbl_eventos;
select * from tbl_places where match(nome) against("Padaria");
select * from tbl_favoritos where FK_usuario_id = 1 and FK_place_id = 1;
delete from tbl_eventos where id = 1;

select * from vw_notas;
select FK_place_id id, round(avg(pontuacao), 1) nota 
    from tbl_avaliacoes 
    group by FK_place_id;


select id, nome, telefone, celular, numero, cep, longitude, latitute, criado 
	from tbl_places 
		where uuid=uuid_to_bin('00036686-9ac5-51e1-b8cc-cc301829b797') 
        and deletado = 0;
        
        
select uuid_from_bin(b.uuid) uuid,b.nome nome, b.coordenadas coordenadas, a.criado criado,
	ST_Distance_Sphere(
        coordenadas,
        point(0, 0)
      ) distancia,
      coalesce(c.nota, 0) nota
    from tbl_favoritos a 
    join tbl_places b on a.FK_place_id = b.id 
     left join vw_notas c on c.id = b.id
    where FK_usuario_id = 1;

select * from tbl_places;
update tbl_places set nota = 4.0 where id = 1;
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
select * from tbl_places where uuid_from_bin(uuid) = "27e992e0-3d87-5a23-b208-4972991ae593";
select uuid_from_bin(uuid) from tbl_places;
select * from tbl_usuario;
select * from tbl_favoritos where FK_usuario_id = 1 and FK_place_id = 1;
select * from tbl_favoritos;
use zero;
select ST_AsGeoJSON(coordenadas) from localizacao;

delete from tbl_favoritos;

delete from tbl_favoritos;

select a.id, uuid_from_bin(uuid) uuid, a.nome, ST_AsGeoJSON(coordenadas) coordenadas , 
      ST_Distance_Sphere(
        coordenadas,
        point(0, 0)
      ) distancia, c.nota, (CASE WHEN b.FK_usuario_id is NOT NULL THEN true ELSE false END) AS favorito
      from tbl_places a 
      join vw_notas c on c.id = a.id
      left join tbl_favoritos b on b.FK_place_id = a.id
        and b.FK_usuario_id = 1 where a.deletado = false order by distancia limit 100 offset 0;
        
select a.id, uuid_from_bin(uuid) uuid, a.nome, coordenadas,
      ST_Distance_Sphere(
        coordenadas,
        point(0, 0)
      ) distancia, 
      coalesce(c.nota, 0) nota, 
      (b.FK_usuario_id IS NOT NULL) favorito
      from tbl_places a
      left join vw_notas c on c.id = a.id
      left join tbl_favoritos b on b.FK_place_id = a.id
      and b.FK_usuario_id = 1
      where a.deletado = false
      order by distancia
      limit 100 offset 0;

select * from tbl_favoritos;

insert into tbl_favoritos(FK_usuario_id, FK_place_id) values(1,3); 

select * from tbl_places_denuncias;
update tbl_places set deletado = true, deletado_dia = now() where id = 1;
update tbl_places set denunciado = true, denuncias = denuncias + 1 where id = 1;

select *
from tbl_logins_has_places a
	join tbl_places b on b.id = a.FK_place_id
		where FK_login_id = 1;

select * from tbl_place_logins;

select * from tbl_avaliacoes;
select * from tbl_respostas;

insert into tbl_respostas(FK_avaliacao_id, fk_place_logins_id, comentario) values(?,?,?);

select * from tbl_usuario;

delete from tbl_place_logins where id = 9;

start transaction;
rollback;

-- fim do modelo antigo ------------------------------






