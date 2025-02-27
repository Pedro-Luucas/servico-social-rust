use sqlx::PgPool;
use uuid::Uuid;
use crate::models::usuario::Usuario;

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
                valor_renda as "valor_renda?", moradia, agua, agua_valor as "agua_valor?", energia, 
                energia_valor as "energia_valor?", bens as "bens?", 
                internet, cras, acesso_cras as "acesso_cras?", desc_doenca as "desc_doenca?", 
                medicamentos as "medicamentos?", medicamentos_gasto as "medicamentos_gasto?", 
                tratamento as "tratamento?", nutri, tempo_tratamento as "tempo_tratamento?", 
                local as "local?", encaminhamento as "encaminhamento?", 
                solicitacoes, motivo_desligamento as "motivo_desligamento?", parecer_social, operador_id as "operador_id?"
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
                resp_parentesco, resp_renda, fonte_renda, valor_renda, moradia, agua, 
                agua_valor, energia, energia_valor, bens, internet, cras, acesso_cras, 
                desc_doenca, medicamentos, medicamentos_gasto, tratamento, nutri, 
                tempo_tratamento, local, encaminhamento, solicitacoes, motivo_desligamento, 
                parecer_social, operador_id
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
                $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, 
                $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, 
                $45, $46, $47
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
            usuario.motivo_desligamento,
            usuario.parecer_social,
            usuario.operador_id
        )
        .execute(pool)
        .await?;

        Ok(())
    }


    pub async fn find_by_nome(pool: &PgPool, nome: &str) -> Result<Vec<Usuario>, sqlx::Error> {
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
                valor_renda as "valor_renda?", moradia, agua, agua_valor as "agua_valor?", energia, 
                energia_valor as "energia_valor?", bens as "bens?", 
                internet, cras, acesso_cras as "acesso_cras?", desc_doenca as "desc_doenca?", 
                medicamentos as "medicamentos?", medicamentos_gasto as "medicamentos_gasto?", 
                tratamento as "tratamento?", nutri, tempo_tratamento as "tempo_tratamento?", 
                local as "local?", encaminhamento as "encaminhamento?", 
                solicitacoes, motivo_desligamento as "motivo_desligamento?", parecer_social, operador_id as "operador_id?"
            FROM usuarios
            WHERE nome ILIKE $1
            "#,
            format!("%{}%", nome)  // Using ILIKE with wildcards for partial name matching
        )
        .fetch_all(pool)
        .await?;
    
        Ok(usuarios)
    }
    
}