use sqlx::PgPool;
use uuid::Uuid;
use crate::models::usuario::Usuario;
use crate::dtos::edit_usuario_dto::EditUsuarioDto;

pub struct UsuarioRepository;

impl UsuarioRepository {
    pub async fn find_by_id(pool: &PgPool, id: Uuid) -> Result<Usuario, sqlx::Error> {
        let usuario = sqlx::query_as!(
            Usuario,
            r#"
            SELECT 
                id, nome, ativo, cpf, rg as "rg?", data_nasc, telefone, profissao as "profissao?", 
                escolaridade, patologia, cep as "cep?", municipio, bairro as "bairro?", 
                rua as "rua?", numero as "numero?", referencia as "referencia?", resp_nome as "resp_nome?", 
                resp_cpf as "resp_cpf?", resp_idade as "resp_idade?", resp_telefone as "resp_telefone?", 
                resp_profissao as "resp_profissao?", resp_escolaridade as "resp_escolaridade?", 
                resp_parentesco as "resp_parentesco?", resp_renda as "resp_renda?", fonte_renda, 
                valor_renda as "valor_renda?", moradia, moradia_valor as "moradia_valor?", agua, agua_valor as "agua_valor?", energia, 
                energia_valor as "energia_valor?", bens as "bens?", 
                internet, cras, acesso_cras as "acesso_cras?", desc_doenca as "desc_doenca?", 
                medicamentos as "medicamentos?", medicamentos_gasto as "medicamentos_gasto?", 
                tratamento as "tratamento?", nutri, tempo_tratamento as "tempo_tratamento?", 
                local as "local?", encaminhamento as "encaminhamento?", 
                solicitacoes, observacoes as "observacoes?", motivo_desligamento as "motivo_desligamento?", parecer_social, operador_id as "operador_id?"
            FROM usuarios
            WHERE id = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(usuario)
    }

    pub async fn save(pool: &PgPool, usuario: &Usuario) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"
            INSERT INTO usuarios (
                id, nome, ativo, cpf, rg, data_nasc, telefone, profissao, escolaridade, 
                patologia, cep, municipio, bairro, rua, numero, referencia, resp_nome, 
                resp_cpf, resp_idade, resp_telefone, resp_profissao, resp_escolaridade, 
                resp_parentesco, resp_renda, fonte_renda, valor_renda, moradia, moradia_valor, agua, 
                agua_valor, energia, energia_valor, bens, internet, cras, acesso_cras, 
                desc_doenca, medicamentos, medicamentos_gasto, tratamento, nutri, 
                tempo_tratamento, local, encaminhamento, solicitacoes, observacoes, motivo_desligamento, 
                parecer_social, operador_id
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
                $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, 
                $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, 
                $45, $46, $47, $48, $49
            )
            "#,
            usuario.id,
            usuario.nome,
            usuario.ativo,
            usuario.cpf,
            usuario.rg,
            usuario.data_nasc,
            usuario.telefone,
            usuario.profissao,
            usuario.escolaridade,
            usuario.patologia,
            usuario.cep,
            usuario.municipio,
            usuario.bairro,
            usuario.rua,
            usuario.numero,
            usuario.referencia,
            usuario.resp_nome,
            usuario.resp_cpf,
            usuario.resp_idade,
            usuario.resp_telefone,
            usuario.resp_profissao,
            usuario.resp_escolaridade,
            usuario.resp_parentesco,
            usuario.resp_renda,
            usuario.fonte_renda,
            usuario.valor_renda,
            usuario.moradia,
            usuario.moradia_valor,
            usuario.agua,
            usuario.agua_valor,
            usuario.energia,
            usuario.energia_valor,
            usuario.bens,
            usuario.internet,
            usuario.cras,
            usuario.acesso_cras,
            usuario.desc_doenca,
            usuario.medicamentos,
            usuario.medicamentos_gasto,
            usuario.tratamento,
            usuario.nutri,
            usuario.tempo_tratamento,
            usuario.local,
            usuario.encaminhamento,
            usuario.solicitacoes,
            usuario.observacoes,
            usuario.motivo_desligamento,
            usuario.parecer_social,
            usuario.operador_id
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    pub async fn find_by_nome(pool: &PgPool, nome: &str) -> Result<Vec<Usuario>, sqlx::Error> {
        let search_nome = format!("%{}%", nome);
        let usuarios = sqlx::query_as!(
            Usuario,
            r#"
            SELECT 
                id, nome, ativo, cpf, rg as "rg?", data_nasc, telefone, profissao as "profissao?", 
                escolaridade, patologia, cep as "cep?", municipio, bairro as "bairro?", 
                rua as "rua?", numero as "numero?", referencia as "referencia?", resp_nome as "resp_nome?", 
                resp_cpf as "resp_cpf?", resp_idade as "resp_idade?", resp_telefone as "resp_telefone?", 
                resp_profissao as "resp_profissao?", resp_escolaridade as "resp_escolaridade?", 
                resp_parentesco as "resp_parentesco?", resp_renda as "resp_renda?", fonte_renda, 
                valor_renda as "valor_renda?", moradia, moradia_valor as "moradia_valor?", agua, agua_valor as "agua_valor?", energia, 
                energia_valor as "energia_valor?", bens as "bens?", 
                internet, cras, acesso_cras as "acesso_cras?", desc_doenca as "desc_doenca?", 
                medicamentos as "medicamentos?", medicamentos_gasto as "medicamentos_gasto?", 
                tratamento as "tratamento?", nutri, tempo_tratamento as "tempo_tratamento?", 
                local as "local?", encaminhamento as "encaminhamento?", 
                solicitacoes, observacoes as "observacoes?", motivo_desligamento as "motivo_desligamento?", parecer_social, operador_id as "operador_id?"
            FROM usuarios
            WHERE nome ILIKE $1
            "#,
            search_nome
        )
        .fetch_all(pool)
        .await?;
    
        Ok(usuarios)
    }

    pub async fn find_by_telefone(pool: &PgPool, telefone: &str) -> Result<Vec<Usuario>, sqlx::Error> {
        let search_telefone = format!("%{}%", telefone);
        let usuarios = sqlx::query_as!(
            Usuario,
            r#"
            SELECT 
                id, nome, ativo, cpf, rg as "rg?", data_nasc, telefone, profissao as "profissao?", 
                escolaridade, patologia, cep as "cep?", municipio, bairro as "bairro?", 
                rua as "rua?", numero as "numero?", referencia as "referencia?", resp_nome as "resp_nome?", 
                resp_cpf as "resp_cpf?", resp_idade as "resp_idade?", resp_telefone as "resp_telefone?", 
                resp_profissao as "resp_profissao?", resp_escolaridade as "resp_escolaridade?", 
                resp_parentesco as "resp_parentesco?", resp_renda as "resp_renda?", fonte_renda, 
                valor_renda as "valor_renda?", moradia, moradia_valor as "moradia_valor?", agua, agua_valor as "agua_valor?", energia, 
                energia_valor as "energia_valor?", bens as "bens?", 
                internet, cras, acesso_cras as "acesso_cras?", desc_doenca as "desc_doenca?", 
                medicamentos as "medicamentos?", medicamentos_gasto as "medicamentos_gasto?", 
                tratamento as "tratamento?", nutri, tempo_tratamento as "tempo_tratamento?", 
                local as "local?", encaminhamento as "encaminhamento?", 
                solicitacoes, observacoes as "observacoes?", motivo_desligamento as "motivo_desligamento?", parecer_social, operador_id as "operador_id?"
            FROM usuarios
            WHERE telefone LIKE $1
            "#,
            search_telefone
        )
        .fetch_all(pool)
        .await?;
    
        Ok(usuarios)
    }
    
    pub async fn find_by_cep(pool: &PgPool, cep: &str) -> Result<Vec<Usuario>, sqlx::Error> {
        let search_cep = format!("%{}%", cep);
        let usuarios = sqlx::query_as!(
            Usuario,
            r#"
            SELECT 
                id, nome, ativo, cpf, rg as "rg?", data_nasc, telefone, profissao as "profissao?", 
                escolaridade, patologia, cep as "cep?", municipio, bairro as "bairro?", 
                rua as "rua?", numero as "numero?", referencia as "referencia?", resp_nome as "resp_nome?", 
                resp_cpf as "resp_cpf?", resp_idade as "resp_idade?", resp_telefone as "resp_telefone?", 
                resp_profissao as "resp_profissao?", resp_escolaridade as "resp_escolaridade?", 
                resp_parentesco as "resp_parentesco?", resp_renda as "resp_renda?", fonte_renda, 
                valor_renda as "valor_renda?", moradia, moradia_valor as "moradia_valor?", agua, agua_valor as "agua_valor?", energia, 
                energia_valor as "energia_valor?", bens as "bens?", 
                internet, cras, acesso_cras as "acesso_cras?", desc_doenca as "desc_doenca?", 
                medicamentos as "medicamentos?", medicamentos_gasto as "medicamentos_gasto?", 
                tratamento as "tratamento?", nutri, tempo_tratamento as "tempo_tratamento?", 
                local as "local?", encaminhamento as "encaminhamento?", 
                solicitacoes, observacoes as "observacoes?", motivo_desligamento as "motivo_desligamento?", parecer_social, operador_id as "operador_id?"
            FROM usuarios
            WHERE cep LIKE $1
            "#,
            search_cep
        )
        .fetch_all(pool)
        .await?;
    
        Ok(usuarios)
    }
    
    pub async fn find_by_cpf(pool: &PgPool, cpf: &str) -> Result<Vec<Usuario>, sqlx::Error> {
        let search_cpf = format!("%{}%", cpf);
        let usuarios = sqlx::query_as!(
            Usuario,
            r#"
            SELECT 
                id, nome, ativo, cpf, rg as "rg?", data_nasc, telefone, profissao as "profissao?", 
                escolaridade, patologia, cep as "cep?", municipio, bairro as "bairro?", 
                rua as "rua?", numero as "numero?", referencia as "referencia?", resp_nome as "resp_nome?", 
                resp_cpf as "resp_cpf?", resp_idade as "resp_idade?", resp_telefone as "resp_telefone?", 
                resp_profissao as "resp_profissao?", resp_escolaridade as "resp_escolaridade?", 
                resp_parentesco as "resp_parentesco?", resp_renda as "resp_renda?", fonte_renda, 
                valor_renda as "valor_renda?", moradia, moradia_valor as "moradia_valor?", agua, agua_valor as "agua_valor?", energia, 
                energia_valor as "energia_valor?", bens as "bens?", 
                internet, cras, acesso_cras as "acesso_cras?", desc_doenca as "desc_doenca?", 
                medicamentos as "medicamentos?", medicamentos_gasto as "medicamentos_gasto?", 
                tratamento as "tratamento?", nutri, tempo_tratamento as "tempo_tratamento?", 
                local as "local?", encaminhamento as "encaminhamento?", 
                solicitacoes, observacoes as "observacoes?", motivo_desligamento as "motivo_desligamento?", parecer_social, operador_id as "operador_id?"
            FROM usuarios
            WHERE cpf LIKE $1
            "#,
            search_cpf
        )
        .fetch_all(pool)
        .await?;
    
        Ok(usuarios)
    }

    pub async fn update(pool: &PgPool, id: Uuid, dto: EditUsuarioDto) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"
            UPDATE usuarios
            SET 
                nome = COALESCE($1, nome),
                ativo = COALESCE($2, ativo),
                cpf = COALESCE($3, cpf),
                rg = COALESCE($4, rg),
                data_nasc = COALESCE($5, data_nasc),
                telefone = COALESCE($6, telefone),
                profissao = COALESCE($7, profissao),
                escolaridade = COALESCE($8, escolaridade),
                patologia = COALESCE($9, patologia),
                cep = COALESCE($10, cep),
                municipio = COALESCE($11, municipio),
                bairro = COALESCE($12, bairro),
                rua = COALESCE($13, rua),
                numero = COALESCE($14, numero),
                referencia = COALESCE($15, referencia),
                resp_nome = COALESCE($16, resp_nome),
                resp_cpf = COALESCE($17, resp_cpf),
                resp_idade = COALESCE($18, resp_idade),
                resp_telefone = COALESCE($19, resp_telefone),
                resp_profissao = COALESCE($20, resp_profissao),
                resp_escolaridade = COALESCE($21, resp_escolaridade),
                resp_parentesco = COALESCE($22, resp_parentesco),
                resp_renda = COALESCE($23, resp_renda),
                fonte_renda = COALESCE($24, fonte_renda),
                valor_renda = COALESCE($25, valor_renda),
                moradia = COALESCE($26, moradia),
                moradia_valor = COALESCE($27, moradia_valor),
                agua = COALESCE($28, agua),
                agua_valor = COALESCE($29, agua_valor),
                energia = COALESCE($30, energia),
                energia_valor = COALESCE($31, energia_valor),
                bens = COALESCE($32, bens),
                internet = COALESCE($33, internet),
                cras = COALESCE($34, cras),
                acesso_cras = COALESCE($35, acesso_cras),
                desc_doenca = COALESCE($36, desc_doenca),
                medicamentos = COALESCE($37, medicamentos),
                medicamentos_gasto = COALESCE($38, medicamentos_gasto),
                tratamento = COALESCE($39, tratamento),
                nutri = COALESCE($40, nutri),
                tempo_tratamento = COALESCE($41, tempo_tratamento),
                local = COALESCE($42, local),
                encaminhamento = COALESCE($43, encaminhamento),
                solicitacoes = COALESCE($44, solicitacoes),
                observacoes = COALESCE($45, observacoes),
                motivo_desligamento = COALESCE($46, motivo_desligamento),
                parecer_social = COALESCE($47, parecer_social),
                operador_id = COALESCE($48, operador_id)
            WHERE id = $49
            "#,
            dto.nome,
            dto.ativo,
            dto.cpf,
            dto.rg,
            dto.data_nasc,
            dto.telefone,
            dto.profissao,
            dto.escolaridade,
            dto.patologia,
            dto.cep,
            dto.municipio,
            dto.bairro,
            dto.rua,
            dto.numero,
            dto.referencia,
            dto.resp_nome,
            dto.resp_cpf,
            dto.resp_idade,
            dto.resp_telefone,
            dto.resp_profissao,
            dto.resp_escolaridade,
            dto.resp_parentesco,
            dto.resp_renda,
            dto.fonte_renda,
            dto.valor_renda,
            dto.moradia,
            dto.moradia_valor,
            dto.agua,
            dto.agua_valor,
            dto.energia,
            dto.energia_valor,
            dto.bens,
            dto.internet,
            dto.cras,
            dto.acesso_cras,
            dto.desc_doenca,
            dto.medicamentos,
            dto.medicamentos_gasto,
            dto.tratamento,
            dto.nutri,
            dto.tempo_tratamento,
            dto.local,
            dto.encaminhamento,
            dto.solicitacoes,
            dto.observacoes,
            dto.motivo_desligamento,
            dto.parecer_social,
            dto.operador_id,
            id
        )
        .execute(pool)
        .await?;

        Ok(())
    }
    
}