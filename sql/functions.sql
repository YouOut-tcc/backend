
-- from https://gist.github.com/Lunaxod/7ccd1dae6f6f7ba2dfac338bf654c881
DELIMITER //

CREATE FUNCTION uuid_from_bin(b BINARY(16))
  RETURNS CHAR(36)
  BEGIN
  DECLARE hex CHAR(32);
  SET hex = HEX(b);
  RETURN LOWER(CONCAT(LEFT(hex, 8), '-', MID(hex, 9,4), '-', MID(hex, 13,4), '-', MID(hex, 17,4), '-', RIGHT(hex, 12)));
END //

CREATE FUNCTION uuid_to_bin(s CHAR(36))
  RETURNS BINARY(16)
  RETURN UNHEX(CONCAT(LEFT(s, 8), MID(s, 10, 4), MID(s, 15, 4), MID(s, 20, 4), RIGHT(s, 12))) //


CREATE FUNCTION `uuid_v5`(ns CHAR(36), name VARCHAR(2000))
  RETURNS
    BINARY(16)
  BEGIN
    SET @ns_bin = uuid_to_bin(ns);
    SET @prehash_value = CONCAT(@ns_bin, name);
    SET @hashed_value = SHA1(@prehash_value);

    SET @time_hi = MID(@hashed_value, 13, 4);
    SET @time_hi = CONV(@time_hi, 16, 10) & 0x0fff;
    SET @time_hi = @time_hi & ~(0xf000);
    SET @time_hi = @time_hi | (5 << 12);

    SET @clock_seq_hi = MID(@hashed_value, 17, 2);
    SET @clock_seq_hi = CONV(@clock_seq_hi, 16, 10);
    SET @clock_seq_hi = @clock_seq_hi & 0x3f;
    SET @clock_seq_hi = @clock_seq_hi & ~(0xc0);
    SET @clock_seq_hi = @clock_seq_hi | 0x80;

    SET @time_low = LEFT(@hashed_value, 8);
    SET @time_mid = MID(@hashed_value, 9, 4);
    SET @time_hi_and_version = lpad(conv(@time_hi, 10, 16), 4, '0');
    SET @clock_seq_hi_and_reserved = lpad(conv(@clock_seq_hi, 10, 16), 2, '0');
    SET @clock_seq_low = MID(@hashed_value, 19, 2);
    SET @node = lpad(MID(@hashed_value, 21, 12), 12, '0');

    SET @clock_seq = CONCAT(@clock_seq_hi_and_reserved, @clock_seq_low);

    SET @uuid_str = CONCAT_WS('-', @time_low, @time_mid, @time_hi_and_version, @clock_seq, @node);

    RETURN uuid_to_bin(@uuid_str);
  END //

-- UUID v4 FROM: https://stackoverflow.com/a/32965744/206729
CREATE FUNCTION uuid_v4()
    RETURNS CHAR(36)
BEGIN
    -- Generate 8 2-byte strings that we will combine into a UUIDv4
    SET @h1 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h2 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h3 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h6 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h7 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h8 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');

    -- 4th section will start with a 4 indicating the version
    SET @h4 = CONCAT('4', LPAD(HEX(FLOOR(RAND() * 0x0fff)), 3, '0'));

    -- 5th section first half-byte can only be 8, 9 A or B
    SET @h5 = CONCAT(HEX(FLOOR(RAND() * 4 + 8)),
                LPAD(HEX(FLOOR(RAND() * 0x0fff)), 3, '0'));

    -- Build the complete UUID
    RETURN LOWER(CONCAT(
        @h1, @h2, '-', @h3, '-', @h4, '-', @h5, '-', @h6, @h7, @h8
    ));
END
//
-- Switch back the delimiter

CREATE FUNCTION `uuid_v3`(ns CHAR(36), name VARCHAR(2000))
  RETURNS
    BINARY(16)
  BEGIN
    SET @ns_bin = uuid_to_bin(ns);
    SET @prehash_value = CONCAT(@ns_bin, name);
    SET @hashed_value = MD5(@prehash_value);

    SET @time_hi = MID(@hashed_value, 13, 4);
    SET @time_hi = CONV(@time_hi, 16, 10) & 0x0fff;
    SET @time_hi = @time_hi & ~(0xf000);
    SET @time_hi = @time_hi | (3 << 12);

    SET @clock_seq_hi = MID(@hashed_value, 17, 2);
    SET @clock_seq_hi = CONV(@clock_seq_hi, 16, 10);
    SET @clock_seq_hi = @clock_seq_hi & 0x3f;
    SET @clock_seq_hi = @clock_seq_hi & ~(0xc0);
    SET @clock_seq_hi = @clock_seq_hi | 0x80;

    SET @time_low = LEFT(@hashed_value, 8);
    SET @time_mid = MID(@hashed_value, 9, 4);
    SET @time_hi_and_version = lpad(conv(@time_hi, 10, 16), 4, '0');
    SET @clock_seq_hi_and_reserved = lpad(conv(@clock_seq_hi, 10, 16), 2, '0');
    SET @clock_seq_low = MID(@hashed_value, 19, 2);
    SET @node = lpad(MID(@hashed_value, 21, 12), 12, '0');

    SET @clock_seq = CONCAT(@clock_seq_hi_and_reserved, @clock_seq_low);

    SET @uuid_str = CONCAT_WS('-', @time_low, @time_mid, @time_hi_and_version, @clock_seq, @node);

    RETURN uuid_to_bin(@uuid_str);
  END //
  
DELIMITER ;

--