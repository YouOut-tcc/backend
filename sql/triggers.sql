use youout;
delimiter //

-- sera que esses if not exists vai dar erra para quem usa xampp?

create trigger if not exists trg_place_denunciar after insert on tbl_places_denuncias
for each row
begin
	update tbl_places set denunciado = true where id = new.fk_place_id;
end;//

create trigger if not exists trg_alaviacoes_denunciar after insert on tbl_avaliacoes_denuncias
for each row
begin
	update tbl_avaliacoes set denunciado = true where id = new.fk_avaliacoes_id;
end;//

create trigger if not exists trg_respotas_denunciar after insert on tbl_respotas_denuncias
for each row
begin
	update tbl_respotas set denunciado = true where id = new.fk_respotas_id;
end;//

delimiter ;