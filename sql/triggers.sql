drop trigger if exists trg_denunciar_place;
drop trigger if exists trg_denunciar_avaliacao;
drop trigger if exists trg_denunciar_resposta;

delimiter //

create trigger trg_denunciar_place after insert on tbl_place_denuncias
for each row
begin
	declare denuncias_counter integer;
	
    select denuncias into denuncias_counter from tbl_places where id = new.fk_place_id;
    if denuncias_counter >= 10 then
		update tbl_places set deletado = true, deletado_dia = now() where id = new.fk_place_id;
    end if;
	update tbl_places set denunciado = true, denuncias = denuncias + 1 where id = new.fk_place_id;
end;//

create trigger trg_denunciar_avaliacao after insert on tbl_avaliacao_denuncias
for each row
begin
	declare denuncias_counter integer;
    
    select denuncias into denuncias_counter from tbl_avaliacoes where id = new.fk_avaliacao_id;
	if denuncias_counter >= 10 then
		update tbl_avaliacoes set deletado = true, deletado_dia = now() where id = new.fk_avaliacao_id;
    end if;
	update tbl_avaliacoes set denunciado = true, denuncias = denuncias + 1 where id = new.fk_avaliacao_id;
end;//

create trigger trg_denunciar_resposta after insert on tbl_resposta_denuncias
for each row
begin
	declare denuncias_counter integer;
    
    select denuncias into denuncias_counter from tbl_respostas where id = new.fk_resposta_id;
	if denuncias_counter >= 10 then
		update tbl_respostas set deletado = true, deletado_dia = now() where id = new.fk_resposta_id;
    end if;
	update tbl_respostas set denunciado = true, denuncias = denuncias + 1 where id = new.fk_resposta_id;
end;//

delimiter ;