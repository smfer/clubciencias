-- CreateTable
CREATE TABLE `Alumno` (
    `IdAlumno` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(100) NOT NULL,
    `NoControl` INTEGER NOT NULL,
    `Contraseña` VARCHAR(500) NOT NULL,
    `IdEscuela` INTEGER NOT NULL,

    INDEX `IdEscuela`(`IdEscuela`),
    PRIMARY KEY (`IdAlumno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `IdCategoria` INTEGER NOT NULL AUTO_INCREMENT,
    `IdEscuela` INTEGER NOT NULL,
    `Nombre` VARCHAR(100) NOT NULL,

    INDEX `IdEscuela`(`IdEscuela`),
    PRIMARY KEY (`IdCategoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetallesPedido` (
    `IdDetallesPedido` INTEGER NOT NULL AUTO_INCREMENT,
    `IdPedido` INTEGER NOT NULL,
    `IdProducto` INTEGER NOT NULL,
    `Cantidad` INTEGER NOT NULL,
    `SubTotal` DOUBLE NOT NULL,

    INDEX `IdPedido`(`IdPedido`),
    INDEX `IdProducto`(`IdProducto`),
    PRIMARY KEY (`IdDetallesPedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Escuela` (
    `IdEscuela` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `Contraseña` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`IdEscuela`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `IdPedido` INTEGER NOT NULL AUTO_INCREMENT,
    `Fecha` DATE NOT NULL,
    `IdAlumno` INTEGER NOT NULL,
    `Estado` ENUM('Ordenado', 'Aceptado', 'Listo para Recoger', 'Entregado', 'Cancelado', 'Pago Realizado') NOT NULL,
    `Total` DOUBLE NOT NULL,

    INDEX `IdAlumno`(`IdAlumno`),
    PRIMARY KEY (`IdPedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Personal` (
    `IdPersonal` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(100) NOT NULL,
    `Contraseña` VARCHAR(500) NOT NULL,
    `Rol` ENUM('Administrador', 'Cajero', 'Analista de Datos', 'Gerente de Cafetería') NOT NULL,
    `IdEscuela` INTEGER NOT NULL,

    INDEX `IdEscuela`(`IdEscuela`),
    PRIMARY KEY (`IdPersonal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `IdProducto` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `Url` VARCHAR(1000) NOT NULL,
    `Precio` INTEGER NOT NULL,
    `IdEscuela` INTEGER NOT NULL,
    `IdCategoria` INTEGER NOT NULL,
    `Activado` BOOLEAN NOT NULL,

    INDEX `IdCategoria`(`IdCategoria`),
    INDEX `IdEscuela`(`IdEscuela`),
    PRIMARY KEY (`IdProducto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alumno` ADD CONSTRAINT `Alumno_ibfk_1` FOREIGN KEY (`IdEscuela`) REFERENCES `Escuela`(`IdEscuela`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Categoria` ADD CONSTRAINT `Categoria_ibfk_1` FOREIGN KEY (`IdEscuela`) REFERENCES `Escuela`(`IdEscuela`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DetallesPedido` ADD CONSTRAINT `DetallesPedido_ibfk_1` FOREIGN KEY (`IdPedido`) REFERENCES `Pedido`(`IdPedido`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DetallesPedido` ADD CONSTRAINT `DetallesPedido_ibfk_2` FOREIGN KEY (`IdProducto`) REFERENCES `Producto`(`IdProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_ibfk_1` FOREIGN KEY (`IdAlumno`) REFERENCES `Alumno`(`IdAlumno`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Personal` ADD CONSTRAINT `Personal_ibfk_1` FOREIGN KEY (`IdEscuela`) REFERENCES `Escuela`(`IdEscuela`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_ibfk_1` FOREIGN KEY (`IdCategoria`) REFERENCES `Categoria`(`IdCategoria`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_ibfk_2` FOREIGN KEY (`IdEscuela`) REFERENCES `Escuela`(`IdEscuela`) ON DELETE NO ACTION ON UPDATE NO ACTION;
