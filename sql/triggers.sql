use youout;

drop trigger if exists trg_place_denunciar;
drop trigger if exists trg_alaviacoes_denunciar;
drop trigger if exists trg_avaliacoes_denunciar;
drop trigger if exists trg_respotas_denunciar;
drop trigger if exists trg_respostas_denunciar;

delimiter //

-- sera que esses if not exists vai dar erra para quem usa xampp?
create trigger trg_place_denunciar after insert on tbl_places_denuncias
for each row
begin
	declare denuncias_counter integer;
	
    select denuncias into denuncias_counter from tbl_places where id = new.fk_place_id;
    if denuncias_counter >= 10 then
		update tbl_places set deletado = true, deletado_dia = now() where id = new.fk_place_id;
    end if;
	update tbl_places set denunciado = true, denuncias = denuncias + 1 where id = new.fk_place_id;
end;//

create trigger trg_avaliacoes_denunciar after insert on tbl_avaliacoes_denuncias
for each row
begin
	declare denuncias_counter integer;
    
    select denuncias into denuncias_counter from tbl_avaliacoes where id = new.fk_avaliacoes_id;
	if denuncias_counter >= 10 then
		update tbl_avaliacoes set deletado = true, deletado_dia = now() where id = new.fk_avaliacoes_id;
    end if;
	update tbl_avaliacoes set denunciado = true, denuncias = denuncias + 1 where id = new.fk_avaliacoes_id;
end;//

create trigger trg_respostas_denunciar after insert on tbl_respotas_denuncias
for each row
begin
	declare denuncias_counter integer;
    
    select denuncias into denuncias_counter from tbl_respostas where id = new.fk_respotas_id;
	if denuncias_counter >= 10 then
		update tbl_respostas set deletado = true, deletado_dia = now() where id = new.fk_respotas_id;
    end if;
	update tbl_respostas set denunciado = true, denuncias = denuncias + 1 where id = new.fk_respotas_id;
end;//

delimiter ;