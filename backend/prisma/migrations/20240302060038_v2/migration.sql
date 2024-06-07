/*
  Warnings:

  - You are about to drop the column `IdEscuela` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `Contraseña` on the `Escuela` table. All the data in the column will be lost.
  - You are about to drop the column `Estado` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `Fecha` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `IdAlumno` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `Nombres` on the `Personal` table. All the data in the column will be lost.
  - You are about to alter the column `Rol` on the `Personal` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.
  - You are about to drop the column `Activado` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `IdEscuela` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `Precio` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `Url` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the `Alumno` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetallesPedido` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `IdSubTienda` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Dirreccion` to the `Escuela` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IdCliente` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Nombre` to the `Personal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Calificacion` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Imagen` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PrecioBase` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Alumno` DROP FOREIGN KEY `Alumno_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Categoria` DROP FOREIGN KEY `Categoria_ibfk_1`;

-- DropForeignKey
ALTER TABLE `DetallesPedido` DROP FOREIGN KEY `DetallesPedido_ibfk_1`;

-- DropForeignKey
ALTER TABLE `DetallesPedido` DROP FOREIGN KEY `DetallesPedido_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Pedido` DROP FOREIGN KEY `Pedido_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Producto` DROP FOREIGN KEY `Producto_ibfk_2`;

-- AlterTable
ALTER TABLE `Categoria` DROP COLUMN `IdEscuela`,
    ADD COLUMN `IdSubTienda` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Escuela` DROP COLUMN `Contraseña`,
    ADD COLUMN `Dirreccion` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `Pedido` DROP COLUMN `Estado`,
    DROP COLUMN `Fecha`,
    DROP COLUMN `IdAlumno`,
    ADD COLUMN `IdAlmacen` INTEGER NULL,
    ADD COLUMN `IdCliente` INTEGER NOT NULL,
    ADD COLUMN `Nota` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `Personal` DROP COLUMN `Nombres`,
    ADD COLUMN `Nombre` VARCHAR(100) NOT NULL,
    MODIFY `Contraseña` VARCHAR(1000) NOT NULL,
    MODIFY `Rol` ENUM('Administrador', 'Gerente', 'Cajero', 'Analista') NULL;

-- AlterTable
ALTER TABLE `Producto` DROP COLUMN `Activado`,
    DROP COLUMN `IdEscuela`,
    DROP COLUMN `Precio`,
    DROP COLUMN `Url`,
    ADD COLUMN `Calificacion` DOUBLE NOT NULL,
    ADD COLUMN `Descripcion` VARCHAR(400) NULL,
    ADD COLUMN `Imagen` VARCHAR(1000) NOT NULL,
    ADD COLUMN `PrecioBase` DOUBLE NOT NULL,
    MODIFY `Nombre` VARCHAR(200) NOT NULL;

-- DropTable
DROP TABLE `Alumno`;

-- DropTable
DROP TABLE `DetallesPedido`;

-- CreateTable
CREATE TABLE `Almacen` (
    `IdAlmacen` INTEGER NOT NULL AUTO_INCREMENT,
    `Estado` ENUM('Disponible', 'Mantenimiento', 'Ocupado') NOT NULL,
    `IdEscuela` INTEGER NOT NULL,

    INDEX `IdEscuela`(`IdEscuela`),
    PRIMARY KEY (`IdAlmacen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalificacionProducto` (
    `IdCalificacionProducto` INTEGER NOT NULL AUTO_INCREMENT,
    `IdCliente` INTEGER NOT NULL,
    `IdProducto` INTEGER NOT NULL,
    `Calificacion` DOUBLE NOT NULL,

    INDEX `IdCliente`(`IdCliente`),
    INDEX `IdProducto`(`IdProducto`),
    PRIMARY KEY (`IdCalificacionProducto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `IdCliente` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `Contraseña` VARCHAR(1000) NOT NULL,
    `Numero` BIGINT NOT NULL,

    PRIMARY KEY (`IdCliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetallePedido` (
    `IdDetallePedido` INTEGER NOT NULL AUTO_INCREMENT,
    `IdProducto` INTEGER NOT NULL,
    `IdPedido` INTEGER NOT NULL,
    `SubTotal` DOUBLE NOT NULL,
    `Cantidad` INTEGER NOT NULL,

    INDEX `IdPedido`(`IdPedido`),
    INDEX `IdProducto`(`IdProducto`),
    PRIMARY KEY (`IdDetallePedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleProducto` (
    `IdDetalleProducto` INTEGER NOT NULL AUTO_INCREMENT,
    `IdProducto` INTEGER NOT NULL,
    `Nombre` VARCHAR(100) NOT NULL,
    `Obligatorio` BOOLEAN NOT NULL,
    `Limite` BOOLEAN NOT NULL,
    `Opciones` INTEGER NULL,

    INDEX `IdProducto`(`IdProducto`),
    PRIMARY KEY (`IdDetalleProducto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OpcionPedido` (
    `IdOpcionPedido` INTEGER NOT NULL AUTO_INCREMENT,
    `IdDetallePedido` INTEGER NOT NULL,
    `IdOpcionProducto` INTEGER NOT NULL,
    `Cantidad` INTEGER NOT NULL,

    INDEX `IdDetallePedido`(`IdDetallePedido`),
    INDEX `IdOpcionProducto`(`IdOpcionProducto`),
    PRIMARY KEY (`IdOpcionPedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OpcionProducto` (
    `IdOpcionProducto` INTEGER NOT NULL AUTO_INCREMENT,
    `IdDetalleProducto` INTEGER NOT NULL,
    `Nombre` VARCHAR(100) NOT NULL,
    `Precio` INTEGER NOT NULL,

    INDEX `IdDetalleProducto`(`IdDetalleProducto`),
    PRIMARY KEY (`IdOpcionProducto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubTienda` (
    `IdSubTienda` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) NOT NULL,
    `Imagen` VARCHAR(500) NOT NULL,
    `Calificacion` DOUBLE NOT NULL,
    `IdEscuela` INTEGER NOT NULL,

    INDEX `IdEscuela`(`IdEscuela`),
    PRIMARY KEY (`IdSubTienda`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `IdSubTienda` ON `Categoria`(`IdSubTienda`);

-- CreateIndex
CREATE INDEX `IdAlmacen` ON `Pedido`(`IdAlmacen`);

-- CreateIndex
CREATE INDEX `IdCliente` ON `Pedido`(`IdCliente`);

-- AddForeignKey
ALTER TABLE `Almacen` ADD CONSTRAINT `Almacen_ibfk_1` FOREIGN KEY (`IdEscuela`) REFERENCES `Escuela`(`IdEscuela`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CalificacionProducto` ADD CONSTRAINT `CalificacionProducto_ibfk_1` FOREIGN KEY (`IdCliente`) REFERENCES `Cliente`(`IdCliente`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CalificacionProducto` ADD CONSTRAINT `CalificacionProducto_ibfk_2` FOREIGN KEY (`IdProducto`) REFERENCES `Producto`(`IdProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Categoria` ADD CONSTRAINT `Categoria_ibfk_1` FOREIGN KEY (`IdSubTienda`) REFERENCES `SubTienda`(`IdSubTienda`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DetallePedido` ADD CONSTRAINT `DetallePedido_ibfk_1` FOREIGN KEY (`IdProducto`) REFERENCES `Producto`(`IdProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DetallePedido` ADD CONSTRAINT `DetallePedido_ibfk_2` FOREIGN KEY (`IdPedido`) REFERENCES `Pedido`(`IdPedido`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DetalleProducto` ADD CONSTRAINT `DetalleProducto_ibfk_1` FOREIGN KEY (`IdProducto`) REFERENCES `Producto`(`IdProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OpcionPedido` ADD CONSTRAINT `OpcionPedido_ibfk_1` FOREIGN KEY (`IdDetallePedido`) REFERENCES `DetallePedido`(`IdDetallePedido`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OpcionPedido` ADD CONSTRAINT `OpcionPedido_ibfk_2` FOREIGN KEY (`IdOpcionProducto`) REFERENCES `OpcionProducto`(`IdOpcionProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OpcionProducto` ADD CONSTRAINT `OpcionProducto_ibfk_1` FOREIGN KEY (`IdDetalleProducto`) REFERENCES `DetalleProducto`(`IdDetalleProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_ibfk_1` FOREIGN KEY (`IdCliente`) REFERENCES `Cliente`(`IdCliente`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_ibfk_2` FOREIGN KEY (`IdAlmacen`) REFERENCES `Almacen`(`IdAlmacen`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SubTienda` ADD CONSTRAINT `SubTienda_ibfk_1` FOREIGN KEY (`IdEscuela`) REFERENCES `Escuela`(`IdEscuela`) ON DELETE NO ACTION ON UPDATE NO ACTION;
