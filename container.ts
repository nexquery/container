/*
 * 
 * 	Dosya:
 * 		container.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		13.08.2024, 13:54:03
 * 
 *	Açıklama:
 *		Bu fonksiyon SA:MP sunucusundaki SetPVar özelliğinden
 *		esinlenilip biraz da modifiye edilerek oluşturulmuştur.
*/

import { SetTimer } from "./funcs_timer";

type KULLANICI_DATA = 
{
	data:	Map<string, any> | null;
    zaman:	number;
}

const
	// BELLEK_KONTROL kaç dakika arayla kontrol edilsin?
	BELLEK_KONTROL = 1,

	// Kullanıcı verilerinin tutulacağı konteynır
	Kullanicilar: Map<string, KULLANICI_DATA> = new Map()
;

export function SetPVar(uye_id: string, veri_adi: string, veri_icerigi: any)
{
	// Yeni bir kullanıcı oluştur
	if(!Kullanicilar.has(uye_id))
	{
		Kullanicilar.set(uye_id, 
		{
			zaman:	Date.now(), 
			data:	new Map() 
		});
	}

	// Verileri işle
	const cache = Kullanicilar.get(uye_id);
	if(cache)
	{
		cache.zaman = Date.now();
		cache.data?.set(veri_adi, veri_icerigi);
	}
}

export function GetPVar(uye_id: string, veri_adi: string)
{
	const cache = Kullanicilar.get(uye_id);
	if(cache)
	{
		cache.zaman = Date.now();

		if(cache.data?.has(veri_adi))
		{
			return cache.data?.get(veri_adi);
		}

		return {};
	}
	
	return {};
}

export function EditPVar(uye_id: string, veri_adi: string, yeni_icerik: any)
{
	const cache = Kullanicilar.get(uye_id);
	if(cache)
	{
		cache.zaman = Date.now();

		if(cache.data?.has(veri_adi))
		{
			const eski_data = cache.data?.get(veri_adi);
	
			const yeni_data = 
			{
				...eski_data, ...yeni_icerik
			};

			cache.data?.set(veri_adi, yeni_data);
		}
	}
}

export function EmptyPVar(uye_id: string, veri_adi: string)
{
	const cache = Kullanicilar.get(uye_id);
	if(cache)
	{
		cache.zaman = Date.now();

		if(cache.data?.has(veri_adi))
		{
			const icerik = cache.data?.get(veri_adi);

			if(!icerik && Object.keys(icerik).length === 0) {
				return true;
			}

			if(icerik && Object.keys(icerik).length === 0) {
				return true;
			}
		}
	}
	return false;
}

export function DeletePVar(uye_id: string, veri_adi: string)
{
	const cache = Kullanicilar.get(uye_id);
	if(cache)
	{
		cache.zaman = Date.now();

		if(cache.data?.has(veri_adi))
		{
			cache.data.delete(veri_adi);
		}

		if(cache.data?.size === 0)
		{
			Kullanicilar.delete(uye_id);
		}
	}
}

export function CACHE_KONTROL()
{
	const zaman = Date.now();
	for(const [uye_id, cache] of Kullanicilar.entries())
	{
		if(zaman - cache.zaman > (BELLEK_KONTROL * 60000))
		{
			// Üyenin tüm verileri temizle
			cache.data?.clear();

			// Referansını null olarak ayarla ve çöp toplayıcı otomatik olarak toplasın
			cache.data = null;

			// Üyeyi ana önbellekten sil
			Kullanicilar.delete(uye_id);
		}
	}
}

SetTimer('CACHE_KONTROL', CACHE_KONTROL, 1000);