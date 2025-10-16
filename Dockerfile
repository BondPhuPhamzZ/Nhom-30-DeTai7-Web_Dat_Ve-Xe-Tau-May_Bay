# Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
# For more information, please see https://aka.ms/containercompat

#FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2019
#ARG source
#WORKDIR /inetpub/wwwroot
#COPY ${source:-obj/Docker/publish} .

# === Giai đoạn 1: Build ứng dụng ===
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Lỗi của bạn nằm ở các lệnh COPY.
# Cách sửa: Sao chép file .sln và .csproj trực tiếp từ thư mục gốc, vì chúng không nằm trong thư mục con.
COPY ["*.sln", "."]
COPY ["*.csproj", "."]
RUN dotnet restore

# Sao chép toàn bộ code còn lại
COPY . .

# Publish project một cách cụ thể, vì ta đang ở thư mục gốc /src
RUN dotnet publish "Nhom-30-DeTai7-Web_Dat_Ve-Xe-Tau-May_Bay.csproj" -c Release -o /app/publish --no-restore

# === Giai đoạn 2: Chạy ứng dụng ===
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Nhom-30-DeTai7-Web_Dat_Ve-Xe-Tau-May_Bay.dll"]
