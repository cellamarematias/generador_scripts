// ============================================
// FUNCIONES GENERALES
// ============================================

function switchTab(tab) {
    // Cambiar tabs activos
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    if (tab === 'ddl') {
        document.querySelectorAll('.tab')[0].classList.add('active');
        document.getElementById('ddl-content').classList.add('active');
    } else {
        document.querySelectorAll('.tab')[1].classList.add('active');
        document.getElementById('dml-content').classList.add('active');
    }
}

function formatearFecha(fecha) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

function descargarArchivo(contenido, nombreArchivo) {
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// ============================================
// FUNCIONES DDL
// ============================================

let contadorColumnasDDL = 0;
let contadorFKsDDL = 0;

function agregarColumnaDDL() {
    contadorColumnasDDL++;
    const contenedor = document.getElementById('ddl-columnas');
    
    const div = document.createElement('div');
    div.className = 'form-group';
    div.style.position = 'relative';
    div.style.border = '2px solid #e0e0e0';
    div.style.padding = '15px';
    div.style.borderRadius = '8px';
    div.style.marginBottom = '15px';
    div.id = `columna-${contadorColumnasDDL}`;
    
    div.innerHTML = `
        <button type="button" onclick="eliminarElemento('columna-${contadorColumnasDDL}')" aria-label="Eliminar columna" title="Eliminar" style="position: absolute; top: 8px; right: 8px; background: linear-gradient(135deg,#e55353,#dc3545); color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; justify-content:center; z-index: 2;">Eliminar</button>
        <div style="margin-bottom: 10px;">
            <strong>Columna #${contadorColumnasDDL}</strong>
        </div>
        <div class="grid-2">
            <div>
                <label>Nombre de la Columna</label>
                <input type="text" name="col-nombre-${contadorColumnasDDL}" placeholder="Ej: CuentaBancariaNombre">
            </div>
            <div>
                <label>Tipo de Dato</label>
                <div style="display:flex; gap:10px; align-items:center;">
                    <select name="col-tipo-${contadorColumnasDDL}" onchange="actualizarTipoDato(${contadorColumnasDDL})" style="margin-bottom: 0; flex: 1;">
                    <option value="">Seleccione tipo...</option>
                    <optgroup label="Cadenas de Texto">
                        <option value="varchar()">VARCHAR(n) - Texto variable</option>
                        <option value="nvarchar()">NVARCHAR(n) - Texto Unicode</option>
                        <option value="char()">CHAR(n) - Texto fijo</option>
                        <option value="nchar()">NCHAR(n) - Texto fijo Unicode</option>
                        <option value="text">TEXT - Texto largo</option>
                        <option value="ntext">NTEXT - Texto largo Unicode</option>
                    </optgroup>
                    <optgroup label="Números Enteros">
                        <option value="int">INT - Entero (-2,147,483,648 a 2,147,483,647)</option>
                        <option value="bigint">BIGINT - Entero grande</option>
                        <option value="smallint">SMALLINT - Entero pequeño</option>
                        <option value="tinyint">TINYINT - Entero muy pequeño (0-255)</option>
                    </optgroup>
                    <optgroup label="Números Decimales">
                        <option value="decimal(,)">DECIMAL(p,s) - Decimal exacto</option>
                        <option value="numeric(,)">NUMERIC(p,s) - Numérico exacto</option>
                        <option value="money">MONEY - Dinero</option>
                        <option value="smallmoney">SMALLMONEY - Dinero pequeño</option>
                        <option value="float">FLOAT - Decimal aproximado</option>
                        <option value="real">REAL - Decimal simple</option>
                    </optgroup>
                    <optgroup label="Fecha y Hora">
                        <option value="datetime">DATETIME - Fecha y hora</option>
                        <option value="datetime2">DATETIME2 - Fecha y hora precisa</option>
                        <option value="date">DATE - Solo fecha</option>
                        <option value="time">TIME - Solo hora</option>
                        <option value="smalldatetime">SMALLDATETIME - Fecha y hora simple</option>
                    </optgroup>
                    <optgroup label="Binarios">
                        <option value="bit">BIT - Booleano (0/1)</option>
                        <option value="binary()">BINARY(n) - Binario fijo</option>
                        <option value="varbinary()">VARBINARY(n) - Binario variable</option>
                        <option value="varbinary(max)">VARBINARY(MAX) - Binario grande</option>
                    </optgroup>
                    <optgroup label="Otros">
                        <option value="uniqueidentifier">UNIQUEIDENTIFIER - GUID</option>
                        <option value="xml">XML - Datos XML</option>
                    </optgroup>
                    </select>
                    <input type="text" name="col-tipo-custom-${contadorColumnasDDL}" placeholder="Editar tipo de dato..." style="display: none; flex: 0 0 220px;">
                </div>
            </div>
        </div>
        <div>
            <label>Descripción de la Columna</label>
            <textarea name="col-desc-${contadorColumnasDDL}" placeholder="Descripción breve de la columna"></textarea>
        </div>
        <div class="checkbox-group">
            <input type="checkbox" name="col-null-${contadorColumnasDDL}" id="col-null-${contadorColumnasDDL}">
            <label for="col-null-${contadorColumnasDDL}">¿Permite NULL?</label>
        </div>
    `;
    
    contenedor.appendChild(div);
}

function agregarFKDDL() {
    contadorFKsDDL++;
    const contenedor = document.getElementById('ddl-fks');
    
    const div = document.createElement('div');
    div.className = 'form-group';
    div.style.position = 'relative';
    div.style.border = '2px solid #e0e0e0';
    div.style.padding = '15px';
    div.style.borderRadius = '8px';
    div.style.marginBottom = '15px';
    div.id = `fk-${contadorFKsDDL}`;
    
    div.innerHTML = `
        <button type="button" onclick="eliminarElemento('fk-${contadorFKsDDL}')" aria-label="Eliminar fk" title="Eliminar" style="position: absolute; top: 8px; right: 8px; background: linear-gradient(135deg,#e55353,#dc3545); color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; justify-content:center; z-index: 2;">Eliminar</button>
        <div style="margin-bottom: 10px;">
            <strong>Foreign Key #${contadorFKsDDL}</strong>
        </div>

        <div class="grid-2">
            <div>
                <label>Columna Local</label>
                <input type="text" name="fk-col-local-${contadorFKsDDL}" placeholder="Ej: F_UsuarioIDTit" oninput="actualizarNombreFK(${contadorFKsDDL})">
            </div>
            <div>
                <label>Tabla Referenciada</label>
                <input type="text" name="fk-tabla-ref-${contadorFKsDDL}" placeholder="Ej: Usuario" oninput="actualizarNombreFK(${contadorFKsDDL})">
            </div>
        </div>

        <div class="grid-2">
            <div>
                <label>Columna Referenciada</label>
                <input type="text" name="fk-col-ref-${contadorFKsDDL}" placeholder="Ej: UsuarioID" oninput="actualizarNombreFK(${contadorFKsDDL})">
            </div>
            <div>
                <label>Nombre FK (sugerido)</label>
                <input type="text" name="fk-nombre-${contadorFKsDDL}" placeholder="Ej: FK_CBTarjeta_Titular" data-manual="false" oninput="this.setAttribute('data-manual','true')">
            </div>
        </div>
    `;
    
    contenedor.appendChild(div);
}

function actualizarTipoDato(id) {
    const select = document.querySelector(`[name="col-tipo-${id}"]`);
    const input = document.querySelector(`[name="col-tipo-custom-${id}"]`);
    
    if (select && input) {
        const valor = select.value;
        input.value = valor;
        input.style.display = 'inline-block';
        input.style.width = '220px';
        
        // Si tiene paréntesis, posicionar cursor dentro
        if (valor.includes('(')) {
            input.focus();
            const posicion = valor.indexOf('(') + 1;
            input.setSelectionRange(posicion, posicion);
        }
    }
}

function actualizarNombreFK(id) {
    const nombreInput = document.querySelector(`[name="fk-nombre-${id}"]`);
    if (!nombreInput) return;

    // si el usuario ya editó manualmente, no sobrescribimos
    if (nombreInput.getAttribute('data-manual') === 'true') return;

    const colLocal = (document.querySelector(`[name="fk-col-local-${id}"]`)?.value || '').trim();
    const tablaRef = (document.querySelector(`[name="fk-tabla-ref-${id}"]`)?.value || '').trim();
    const colRef = (document.querySelector(`[name="fk-col-ref-${id}"]`)?.value || '').trim();
    const ddlTabla = (document.getElementById('ddl-tabla')?.value || '').trim();

    let suggested = '';
    if (ddlTabla && colLocal) {
        suggested = `FK_${ddlTabla}_${colLocal}`;
    } else if (tablaRef && colLocal) {
        suggested = `FK_${tablaRef}_${colLocal}`;
    } else if (tablaRef && colRef) {
        suggested = `FK_${tablaRef}_${colRef}`;
    } else if (colLocal) {
        suggested = `FK_${colLocal}`;
    } else if (tablaRef) {
        suggested = `FK_${tablaRef}`;
    } else if (colRef) {
        suggested = `FK_${colRef}`;
    }

    // Normalizar: mayúsculas y guiones bajos, quitar chars inválidos
    suggested = suggested.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');

    if (!suggested) suggested = '';
    nombreInput.value = suggested;
}

function eliminarElemento(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.remove();
    }
}

function generarScriptDDL() {
    const req = document.getElementById('ddl-req').value;
    const usuario = document.getElementById('ddl-usuario').value;
    const fecha = document.getElementById('ddl-fecha').value;
    const descripcion = document.getElementById('ddl-descripcion').value;
    const tabla = document.getElementById('ddl-tabla').value;
    const tablaDesc = document.getElementById('ddl-tabla-desc').value;

    if (!req || !usuario || !fecha || !descripcion || !tabla || !tablaDesc) {
        alert('⚠️ Por favor complete todos los campos obligatorios');
        return;
    }

    const fechaFormateada = formatearFecha(fecha);

    // Construir script
    let script = `/*\n\t[${usuario}] ${fechaFormateada} - Requerimiento ${req}. ${descripcion}\n*/\n\nSET NOCOUNT ON\nBEGIN TRY\n  BEGIN TRANSACTION\n\n\t\t--Crea la Tabla ${tabla}\n\t\tIF NOT EXISTS(select * from sys.tables where object_name(object_id) = '${tabla}')\n\t\tBEGIN\n\t\t\tCREATE TABLE [dbo].[${tabla}](\n\t\t\t\t[${tabla}ID] [int] IDENTITY(1,1) NOT NULL,\n`;

    // Agregar columnas
    for (let i = 1; i <= contadorColumnasDDL; i++) {
        const nombre = document.querySelector(`[name="col-nombre-${i}"]`)?.value;
        const tipoCustom = document.querySelector(`[name="col-tipo-custom-${i}"]`)?.value;
        const tipoSelect = document.querySelector(`[name="col-tipo-${i}"]`)?.value;
        const tipo = tipoCustom || tipoSelect;
        const permiteNull = document.getElementById(`col-null-${i}`)?.checked;
        
        if (nombre && tipo) {
            const nullConstraint = permiteNull ? 'NULL' : 'NOT NULL';
            script += `\t\t\t\t[${nombre}] [${tipo}] ${nullConstraint},\n`;
        }
    }

    // Agregar columnas de auditoría estándar
    script += `\t\t\t\t[FechaAlta] [int] NOT NULL,\n\t\t\t\t[F_UsuarioIDAlta] [int] NOT NULL,\n\t\t\t\t[FechaUltModif] [int] NOT NULL,\n\t\t\t\t[F_UsuarioIDUltModif] [int] NOT NULL,\n\t\t\t CONSTRAINT [PK_dbo.${tabla}] PRIMARY KEY CLUSTERED ([${tabla}ID] ASC)\n\t\t\t) ON [PRIMARY]\n\n`;

    // Agregar Foreign Keys
    for (let i = 1; i <= contadorFKsDDL; i++) {
        const nombreFK = document.querySelector(`[name="fk-nombre-${i}"]`)?.value;
        const colLocal = document.querySelector(`[name="fk-col-local-${i}"]`)?.value;
        const tablaRef = document.querySelector(`[name="fk-tabla-ref-${i}"]`)?.value;
        const colRef = document.querySelector(`[name="fk-col-ref-${i}"]`)?.value;
        
        if (nombreFK && colLocal && tablaRef && colRef) {
            script += `\t\t\tALTER TABLE [dbo].[${tabla}] ADD CONSTRAINT [${nombreFK}] FOREIGN KEY([${colLocal}]) REFERENCES [dbo].[${tablaRef}] ([${colRef}])\n\t\t\t\n`;
        }
    }

    // Agregar descripción de tabla
    script += `\t\t\t--Con la siguiente linea agregamos una descripción sobre la tabla que estamos creando.\n\t\t\tEXEC sys.sp_addextendedproperty \n\t\t\t @name=N'MS_Description'\n\t\t\t,@value=N'${tablaDesc}'\n\t\t\t,@level0type=N'SCHEMA'\n\t\t\t,@level0name=N'dbo'\n\t\t\t,@level1type=N'TABLE'\n\t\t\t,@level1name=N'${tabla}'\n\t\t \n`;

    // Agregar descripciones de columnas
    for (let i = 1; i <= contadorColumnasDDL; i++) {
        const nombre = document.querySelector(`[name="col-nombre-${i}"]`)?.value;
        const desc = document.querySelector(`[name="col-desc-${i}"]`)?.value;
        
        if (nombre && desc) {
            script += `\t\t\t--Con la siguiente linea agregamos una descripción sobre la columna que estamos creando.\n\t\t\tEXEC sys.sp_addextendedproperty \n\t\t\t @name=N'MS_Description'\n\t\t\t,@value=N'${desc}'\n\t\t\t,@level0type=N'SCHEMA'\n\t\t\t,@level0name=N'dbo'\n\t\t\t,@level1type=N'TABLE'\n\t\t\t,@level1name=N'${tabla}'\n\t\t\t,@level2type=N'COLUMN'\n\t\t\t,@level2name=N'${nombre}'\n\n`;
        }
    }

    script += `\t\tEND\n\t\t\n\tPRINT ' Procesado correctamente'\n  COMMIT\nEND TRY\nBEGIN CATCH\n\tROLLBACK\n\tPRINT ' Error'\n\tSELECT ERROR_MESSAGE(),ISNULL(ERROR_PROCEDURE(), '-')\nEND CATCH\nSET NOCOUNT OFF`;

    // Mostrar preview
    document.getElementById('ddl-preview-content').textContent = script;
    document.getElementById('ddl-preview').style.display = 'block';
    document.getElementById('ddl-preview').scrollIntoView({ behavior: 'smooth' });
}

function descargarScriptDDL() {
    const contenido = document.getElementById('ddl-preview-content').textContent;
    const req = document.getElementById('ddl-req').value;
    const tabla = document.getElementById('ddl-tabla').value;
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const nombreArchivo = `${req}_CREATE_${tabla}_${timestamp}.sql`;
    
    descargarArchivo(contenido, nombreArchivo);
}

function limpiarFormularioDDL() {
    document.getElementById('ddl-form').reset();
    document.getElementById('ddl-columnas').innerHTML = '';
    document.getElementById('ddl-fks').innerHTML = '';
    document.getElementById('ddl-preview').style.display = 'none';
    contadorColumnasDDL = 0;
    contadorFKsDDL = 0;
}

// ============================================
// FUNCIONES DML
// ============================================

function actualizarFormularioDML() {
    const operacion = document.getElementById('dml-operacion').value;
    const contenedor = document.getElementById('dml-campos-dinamicos');
    
    contenedor.innerHTML = '';

    if (operacion === 'ALTER_ADD') {
        contenedor.innerHTML = `
            <div class="section-title">➕ Agregar Columna</div>
            <div class="form-group">
                <label>Nombre de la Tabla *</label>
                <input type="text" id="dml-tabla" placeholder="Ej: MatexOrden" required>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label>Nombre de la Columna *</label>
                    <input type="text" id="dml-columna" placeholder="Ej: ComisionAgente" required>
                </div>
                <div class="form-group">
                    <label>Tipo de Dato *</label>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <select id="dml-tipo-select" onchange="actualizarTipoDatoDML()" style="margin-bottom: 0; flex: 1;">
                        <option value="">Seleccione tipo...</option>
                        <optgroup label="Cadenas de Texto">
                            <option value="varchar()">VARCHAR(n)</option>
                            <option value="nvarchar()">NVARCHAR(n)</option>
                            <option value="char()">CHAR(n)</option>
                            <option value="text">TEXT</option>
                        </optgroup>
                        <optgroup label="Números Enteros">
                            <option value="int">INT</option>
                            <option value="bigint">BIGINT</option>
                            <option value="smallint">SMALLINT</option>
                            <option value="tinyint">TINYINT</option>
                        </optgroup>
                        <optgroup label="Números Decimales">
                            <option value="decimal(,)">DECIMAL(p,s)</option>
                            <option value="numeric(,)">NUMERIC(p,s)</option>
                            <option value="money">MONEY</option>
                            <option value="float">FLOAT</option>
                        </optgroup>
                        <optgroup label="Fecha y Hora">
                            <option value="datetime">DATETIME</option>
                            <option value="datetime2">DATETIME2</option>
                            <option value="date">DATE</option>
                            <option value="time">TIME</option>
                        </optgroup>
                        <optgroup label="Otros">
                            <option value="bit">BIT</option>
                            <option value="uniqueidentifier">UNIQUEIDENTIFIER</option>
                            <option value="xml">XML</option>
                        </optgroup>
                    </select>
                    <input type="text" id="dml-tipo" placeholder="Editar tipo de dato..." required style="display: none; flex: 0 0 220px;">
                </div>
                </div>
            </div>
            <div class="form-group checkbox-group">
                <input type="checkbox" id="dml-null" checked>
                <label for="dml-null">¿Permite NULL?</label>
            </div>
        `;
    } else if (operacion === 'UPDATE') {
        contenedor.innerHTML = `
            <div class="section-title">📝 Actualizar Datos</div>
            <div class="form-group">
                <label>Nombre de la Tabla *</label>
                <input type="text" id="dml-tabla" placeholder="Ej: Usuario" required>
            </div>
            <div class="form-group">
                <label>Columnas a actualizar (SET) *</label>
                <textarea id="dml-set" placeholder="Ej: Estado = 1, Activo = 1" required></textarea>
                <div class="help-text">Separar múltiples columnas con comas</div>
            </div>
            <div class="form-group">
                <label>Condición WHERE *</label>
                <textarea id="dml-where" placeholder="Ej: UsuarioID = 123" required></textarea>
            </div>
        `;
    } else if (operacion === 'INSERT') {
        contenedor.innerHTML = `
            <div class="section-title">➕ Insertar Datos</div>
            <div class="form-group">
                <label>Nombre de la Tabla *</label>
                <input type="text" id="dml-tabla" placeholder="Ej: Parametria" required>
            </div>
            <div class="form-group">
                <label>Columnas *</label>
                <input type="text" id="dml-columnas" placeholder="Ej: Nombre, Valor, Descripcion" required>
                <div class="help-text">Separar con comas</div>
            </div>
            <div class="form-group">
                <label>Valores *</label>
                <textarea id="dml-valores" placeholder="Ej: 'Parametro1', 100, 'Descripción del parámetro'" required></textarea>
            </div>
        `;
    } else if (operacion === 'DELETE') {
        contenedor.innerHTML = `
            <div class="section-title">🗑️ Eliminar Datos</div>
            <div class="alert alert-info">
                ⚠️ PRECAUCIÓN: Asegúrese de incluir una condición WHERE específica
            </div>
            <div class="form-group">
                <label>Nombre de la Tabla *</label>
                <input type="text" id="dml-tabla" placeholder="Ej: LogTable" required>
            </div>
            <div class="form-group">
                <label>Condición WHERE *</label>
                <textarea id="dml-where" placeholder="Ej: FechaCreacion < '2023-01-01'" required></textarea>
            </div>
        `;
    }
}

function generarScriptDML() {
    const req = document.getElementById('dml-req').value;
    const usuario = document.getElementById('dml-usuario').value;
    const fecha = document.getElementById('dml-fecha').value;
    const descripcion = document.getElementById('dml-descripcion').value;
    const operacion = document.getElementById('dml-operacion').value;

    if (!req || !usuario || !fecha || !descripcion || !operacion) {
        alert('⚠️ Por favor complete todos los campos obligatorios');
        return;
    }

    const fechaFormateada = formatearFecha(fecha);
    let script = `/*\n\t${usuario} ${fechaFormateada}: ${descripcion}\n*/\n\nSET NOCOUNT ON;\n\nBEGIN TRY\n`;

    if (operacion === 'ALTER_ADD') {
        const tabla = document.getElementById('dml-tabla').value;
        const columna = document.getElementById('dml-columna').value;
        const tipo = document.getElementById('dml-tipo').value;
        const permiteNull = document.getElementById('dml-null').checked;

        if (!tabla || !columna || !tipo) {
            alert('⚠️ Complete todos los campos');
            return;
        }

        const nullConstraint = permiteNull ? 'NULL' : 'NOT NULL';

        script += `\n    -- Verificar si la columna ya existe antes de modificar la tabla\n    IF NOT EXISTS (\n        SELECT * \n        FROM sys.columns \n        WHERE object_id = OBJECT_ID('${tabla}') \n          AND name = '${columna}'\n    )\n    BEGIN\n        BEGIN TRANSACTION;\n\n        ALTER TABLE ${tabla}\n            ADD ${columna} ${tipo} ${nullConstraint};\n\n        PRINT 'Columna ${columna} agregada correctamente.';\n\n        COMMIT;\n    END\n    ELSE\n    BEGIN\n        PRINT 'La columna ${columna} ya existe.';\n    END\n`;
    } else if (operacion === 'UPDATE') {
        const tabla = document.getElementById('dml-tabla').value;
        const set = document.getElementById('dml-set').value;
        const where = document.getElementById('dml-where').value;

        if (!tabla || !set || !where) {
            alert('⚠️ Complete todos los campos');
            return;
        }

        script += `\n    BEGIN TRANSACTION;\n\n    UPDATE ${tabla}\n    SET ${set}\n    WHERE ${where};\n\n    PRINT '✅ Actualización completada correctamente.';\n    PRINT '   Registros afectados: ' + CAST(@@ROWCOUNT AS VARCHAR);\n\n    COMMIT;\n`;
    } else if (operacion === 'INSERT') {
        const tabla = document.getElementById('dml-tabla').value;
        const columnas = document.getElementById('dml-columnas').value;
        const valores = document.getElementById('dml-valores').value;

        if (!tabla || !columnas || !valores) {
            alert('⚠️ Complete todos los campos');
            return;
        }

        script += `\n    BEGIN TRANSACTION;\n\n    INSERT INTO ${tabla} (${columnas})\n    VALUES (${valores});\n\n    PRINT '✅ Registro insertado correctamente.';\n    PRINT '   Nuevo ID: ' + CAST(SCOPE_IDENTITY() AS VARCHAR);\n\n    COMMIT;\n`;
    } else if (operacion === 'DELETE') {
        const tabla = document.getElementById('dml-tabla').value;
        const where = document.getElementById('dml-where').value;

        if (!tabla || !where) {
            alert('⚠️ Complete todos los campos');
            return;
        }

        script += `\n    BEGIN TRANSACTION;\n\n    DELETE FROM ${tabla}\n    WHERE ${where};\n\n    PRINT '✅ Registros eliminados correctamente.';\n    PRINT '   Registros afectados: ' + CAST(@@ROWCOUNT AS VARCHAR);\n\n    COMMIT;\n`;
    }

    script += `\nEND TRY\nBEGIN CATCH\n    IF @@TRANCOUNT > 0\n        ROLLBACK;\n\n    PRINT 'Error al procesar la operación.';\n    SELECT ERROR_MESSAGE() AS MensajeError, ISNULL(ERROR_PROCEDURE(), '-') AS Procedimiento;\nEND CATCH\n\nSET NOCOUNT OFF;`;

    // Mostrar preview
    document.getElementById('dml-preview-content').textContent = script;
    document.getElementById('dml-preview').style.display = 'block';
    document.getElementById('dml-preview').scrollIntoView({ behavior: 'smooth' });
}

function descargarScriptDML() {
    const contenido = document.getElementById('dml-preview-content').textContent;
    const req = document.getElementById('dml-req').value;
    const operacion = document.getElementById('dml-operacion').value;
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const nombreArchivo = `${req}_${operacion}_${timestamp}.sql`;
    
    descargarArchivo(contenido, nombreArchivo);
}

function actualizarTipoDatoDML() {
    const select = document.getElementById('dml-tipo-select');
    const input = document.getElementById('dml-tipo');
    
    if (select && input) {
        const valor = select.value;
        input.value = valor;
        input.style.display = 'inline-block';
        input.style.width = '220px';
        
        // Si tiene paréntesis, posicionar cursor dentro
        if (valor.includes('(')) {
            input.focus();
            const posicion = valor.indexOf('(') + 1;
            input.setSelectionRange(posicion, posicion);
        }
    }
}

function limpiarFormularioDML() {
    document.getElementById('dml-form').reset();
    document.getElementById('dml-campos-dinamicos').innerHTML = '';
    document.getElementById('dml-preview').style.display = 'none';
}

// ============================================
// INICIALIZACIÓN
// ============================================

window.onload = function() {
    // Establecer fecha actual
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('ddl-fecha').value = hoy;
    document.getElementById('dml-fecha').value = hoy;

    // Agregar primera columna por defecto en DDL
    agregarColumnaDDL();
};
